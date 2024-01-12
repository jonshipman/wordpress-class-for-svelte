export interface WpSettings {
	name: string;
	description: string;
	url: string;
	home: string;
	gmt_offset: number;
	timezone_string: string;
	namespaces: Array<string>;
	authentication: {
		'application-passwords': {
			endpoints: {
				authorization: string;
			};
		};
	};
	site_logo: number;
	site_icon: number;
	site_icon_url: string;
	logoMedia?: WpMedia;
	_links: {
		help: Array<{
			href: string;
		}>;
		'wp:featuredmedia': Array<{
			embeddable: boolean;
			type: string;
			href: string;
		}>;
		curies: Array<{
			name: string;
			href: string;
			templated: boolean;
		}>;
	};
}

export interface WpYoast {
	yoast_head: string;
	yoast_head_json: {
		title: string;
		description?: string;
		robots: {
			index: string;
			follow: string;
			'max-snippet': string;
			'max-image-preview': string;
			'max-video-preview': string;
		};
		canonical: string;
		og_locale: string;
		og_type: string;
		og_title: string;
		og_description: string;
		og_url: string;
		og_site_name: string;
		article_publisher: string;
		article_published_time: string;
		article_modified_time: string;
		og_image: Array<{
			width: number;
			height: number;
			url: string;
			type: string;
		}>;
		author: string;
		twitter_card: string;
		twitter_creator: string;
		twitter_site: string;
		twitter_misc: {
			'Written by': string;
			'Est. reading time': string;
		};
		schema: {
			'@context': string;
			'@graph': Array<{
				'@type': string;
				'@id': string;
				isPartOf?: {
					'@id': string;
				};
				author?: {
					name: string;
					'@id': string;
				};
				headline?: string;
				datePublished?: string;
				dateModified?: string;
				mainEntityOfPage?: {
					'@id': string;
				};
				wordCount?: number;
				publisher?: {
					'@id': string;
				};
				inLanguage?: string;
				keywords?: Array<string>;
				url?: string;
				name?: string;
				description?: string;
				breadcrumb?: {
					'@id': string;
				};
				potentialAction?: Array<{
					'@type': string;
					target: Array<string>;
				}>;
				itemListElement?: Array<{
					'@type': string;
					position: number;
					name: string;
					item?: string;
				}>;
				logo?: {
					'@type': string;
					inLanguage: string;
					'@id': string;
					url: string;
					contentUrl: string;
					width: number;
					height: number;
					caption: string;
				};
				image?: {
					'@type'?: string;
					inLanguage?: string;
					'@id': string;
					url?: string;
					contentUrl?: string;
					caption?: string;
				};
				sameAs?: Array<string>;
			}>;
		};
	};
}

export interface MediaDetail {
	file: string;
	width: number;
	height: number;
	filesize?: number;
	mime_type: string;
	source_url: string;
}

// Add additional media sizes.
export interface MediaDetailSizes {
	medium?: MediaDetail;
	large?: MediaDetail;
	thumbnail: MediaDetail;
	full: MediaDetail;
}

export type MediaSize = keyof MediaDetailSizes;

export interface WpMedia extends WpPost {
	caption: {
		rendered: string;
	};
	alt_text: string;
	media_type: string;
	mime_type: string;
	media_details: {
		width: number;
		height: number;
		file: string;
		filesize?: number;
		sizes: MediaDetailSizes;
		image_meta: {
			aperture: string;
			credit: string;
			camera: string;
			caption: string;
			created_timestamp: string;
			copyright: string;
			focal_length: string;
			iso: string;
			shutter_speed: string;
			title: string;
			orientation: string;
			keywords: Array<string>;
		};
		original_image?: string;
	};
	source_url: string;
}

export interface WpPostMeta {
	// Post Meta Here.
}

export interface WpTerm extends WpYoast {
	id: number;
	link: string;
	name: string;
	slug: string;
	taxonomy: string;
	_links: {
		self: Array<{
			href: string;
		}>;
		collection: Array<{
			href: string;
		}>;
		about: Array<{
			href: string;
		}>;
		'wp:post_type': Array<{
			href: string;
		}>;
		curies: Array<{
			name: string;
			href: string;
			templated: boolean;
		}>;
		up?: Array<{
			embeddable: boolean;
			href: string;
		}>;
	};
}

export interface WpEmbedded {
	author: Array<{
		code: string;
		message: string;
		data: {
			status: number;
		};
	}>;
	'wp:featuredmedia': WpMedia[];
	'wp:term': Array<WpTerm[]>;
}

export interface WpPost extends WpYoast {
	id: number;
	date: string;
	date_gmt: string;
	guid: {
		rendered: string;
	};
	modified: string;
	modified_gmt: string;
	slug: string;
	status: string;
	type: string;
	link: string;
	title: {
		rendered: string;
	};
	content: {
		rendered: string;
		protected: boolean;
	};
	excerpt: {
		rendered: string;
		protected: boolean;
	};
	author: number;
	featured_media: number;
	comment_status: string;
	ping_status: string;
	sticky: boolean;
	template: string;
	format: string;
	meta: WpPostMeta;
	categories: Array<number>;
	tags: Array<number>;
	post_class: string;
	_links: {
		self: Array<{
			href: string;
		}>;
		collection: Array<{
			href: string;
		}>;
		about: Array<{
			href: string;
		}>;
		author: Array<{
			embeddable: boolean;
			href: string;
		}>;
		replies: Array<{
			embeddable: boolean;
			href: string;
		}>;
		'version-history': Array<{
			count: number;
			href: string;
		}>;
		'wp:featuredmedia': Array<{
			embeddable: boolean;
			href: string;
		}>;
		'wp:attachment': Array<{
			href: string;
		}>;
		'wp:term': Array<{
			taxonomy: string;
			embeddable: boolean;
			href: string;
		}>;
		curies: Array<{
			name: string;
			href: string;
			templated: boolean;
		}>;
	};
	_embedded: WpEmbedded;
}

export interface WpPosts<T = WpPost> {
	results: T[];
	total: number;
}

export type WpPage = WpPost;
