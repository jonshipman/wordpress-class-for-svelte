import { WORDPRESS, WP_PASS, WP_USER } from '$env/static/private';
import { type WpMedia, type WpPage, type WpPost, type WpPosts, type WpSettings } from '$lib/wp';

interface CacheType {
	post: unknown;
	expires: number;
}

export interface PostFilteredOptions {
	page: number;
	limit: number;
	category?: string;
	tag?: string;
	slug?: string;
	postType?: string;
	parent?: number;
	orderby?: string;
	order?: 'asc' | 'desc';
}

class Wp {
	static user: string;
	static pass: string;
	static baseUrl: string;
	static memcache: Map<string, CacheType>;
	fetch: typeof fetch;

	constructor(f = fetch) {
		this.fetch = f;
	}

	token() {
		const self = this.constructor as typeof Wp;
		const up = `${self.user}:${self.pass}`;
		return Buffer.from(up, 'utf8').toString('base64');
	}

	getcache<T extends WpPost>(key: string): T | null {
		const self = this.constructor as typeof Wp;
		if (self.memcache.has(key)) {
			const cache = self.memcache.get(key);

			if (cache && cache.expires > Date.now()) {
				return cache.post as T;
			}
		}

		return null;
	}

	cache<T extends WpPost>(key: string, post: T) {
		const self = this.constructor as typeof Wp;
		self.memcache.set(key, { post, expires: Date.now() + 3600000 });
	}

	async process(response: Response) {
		const self = this.constructor as typeof Wp;
		const result = await response.text();
		const removeUrl = new URL(self.baseUrl);
		const remove = removeUrl.protocol + '\\/\\/' + removeUrl.host;
		const content = result
			.replaceAll(remove, '')
			.replaceAll('\\/wp-content', remove + '\\/wp-content');

		return JSON.parse(content);
	}

	async settings(): Promise<WpSettings> {
		const self = this.constructor as typeof Wp;
		const response = await this.fetch(self.baseUrl);
		const result = await this.process(response);

		if (result.site_logo) {
			const logoMedia = await this.postById<WpMedia>(result.site_logo, 'media');
			if (logoMedia) {
				result.logoMedia = logoMedia;
			}

			return result;
		}

		return result;
	}

	async posts<T extends WpPost>(options: PostFilteredOptions): Promise<WpPosts<T>> {
		const self = this.constructor as typeof Wp;
		const { page, limit } = options;
		const postType = options.postType || 'posts';

		const url = new URL(self.baseUrl + '/wp/v2/' + postType);
		url.searchParams.set('page', page + '');
		url.searchParams.set('per_page', limit + '');
		url.searchParams.set('_embed', '1');

		if (options.slug) url.searchParams.set('slug', options.slug);

		if (options.category) {
			const categoryQueryUrl = new URL(self.baseUrl + '/wp/v2/categories');
			categoryQueryUrl.searchParams.set('slug', options.category);

			const catResp = await this.fetch(categoryQueryUrl.toString());
			const catResult = await this.process(catResp);

			if (!catResult || !catResult.length) return { results: [], total: 0 };

			url.searchParams.set('categories', '' + catResult[0].id);
		}

		if (options.tag) {
			const tagQueryUrl = new URL(self.baseUrl + '/wp/v2/tags');
			tagQueryUrl.searchParams.set('slug', options.tag);

			const tagResp = await this.fetch(tagQueryUrl.toString());
			const tagResult = await this.process(tagResp);

			if (!tagResult || !tagResult.length) return { results: [], total: 0 };

			url.searchParams.set('tags', '' + tagResult[0].id);
		}

		if (options.parent !== undefined) {
			url.searchParams.set('parent', '' + options.parent);
		}

		if (options.orderby !== undefined) {
			url.searchParams.set('orderby', '' + options.orderby);
		}

		if (options.order !== undefined) {
			url.searchParams.set('order', '' + options.order);
		}

		const response = await this.fetch(url.toString());
		const totalPageCount = response.headers.get('x-wp-totalpages') || '0';

		return { results: await this.process(response), total: parseInt(totalPageCount) };
	}

	async postById<T extends WpPost>(id: number, postType = 'posts'): Promise<null | T> {
		const self = this.constructor as typeof Wp;
		const cache = this.getcache<T>('' + id);
		if (cache) return cache;

		const url = new URL(self.baseUrl + '/wp/v2/' + postType + '/' + id);
		url.searchParams.set('_embed', '1');

		const response = await this.fetch(url.toString());
		if (response.ok) {
			const result = await this.process(response);
			this.cache('' + id, result);
			this.cache(result.slug, result);
			return result;
		}

		return null;
	}

	async post<T extends WpPost>(slug: string, postType = 'posts'): Promise<null | T> {
		const cache = this.getcache<T>(slug);
		if (cache) return cache;

		const posts = await this.posts<T>({ page: 1, limit: 1, slug, postType });
		if (posts.total) {
			const post = posts.results[0];
			this.cache(slug, post);
			this.cache('' + post.id, post);
			return post;
		}

		return null;
	}

	pages(options: PostFilteredOptions) {
		return this.posts<WpPage>({ ...options, postType: 'pages' });
	}

	pageById(id: number) {
		return this.postById<WpPage>(id, 'pages');
	}

	page(slug: string) {
		return this.post<WpPage>(slug, 'pages');
	}
}

Wp.baseUrl = WORDPRESS;
Wp.user = WP_USER;
Wp.pass = WP_PASS;
Wp.memcache = new Map<string, CacheType>();

export default Wp;
