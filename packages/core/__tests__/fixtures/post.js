export default {
	"id": 1,
	"date": "2017-11-06T16:43:33",
	"date_gmt": "2017-11-06T16:43:33",
	"guid": {
		"rendered": "http://wordpress.test/?p=1"
	},
	"modified": "2018-02-05T18:41:15",
	"modified_gmt": "2018-02-05T18:41:15",
	"slug": "hello-world",
	"status": "publish",
	"type": "post",
	"link": "http://wordpress.test/blog/2017/11/06/hello-world/",
	"title": {
		"rendered": "Hello, world"
	},
	"content": {
		"rendered": "<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>\n",
		"protected": false
	},
	"excerpt": {
		"rendered": "<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>\n",
		"protected": false
	},
	"author": 1,
	"featured_media": 0,
	"comment_status": "open",
	"ping_status": "open",
	"sticky": false,
	"template": "",
	"format": "standard",
	"meta": [],
	"categories": [1],
	"tags": [],
	"_links": {
		"self": [{
			"href": "http://wordpress.test/wp-json/wp/v2/posts/1"
		}],
		"collection": [{
			"href": "http://wordpress.test/wp-json/wp/v2/posts"
		}],
		"about": [{
			"href": "http://wordpress.test/wp-json/wp/v2/types/post"
		}],
		"author": [{
			"embeddable": true,
			"href": "http://wordpress.test/wp-json/wp/v2/users/1"
		}],
		"replies": [{
			"embeddable": true,
			"href": "http://wordpress.test/wp-json/wp/v2/comments?post=1"
		}],
		"version-history": [{
			"href": "http://wordpress.test/wp-json/wp/v2/posts/1/revisions"
		}],
		"wp:attachment": [{
			"href": "http://wordpress.test/wp-json/wp/v2/media?parent=1"
		}],
		"wp:term": [{
			"taxonomy": "category",
			"embeddable": true,
			"href": "http://wordpress.test/wp-json/wp/v2/categories?post=1"
		}, {
			"taxonomy": "post_tag",
			"embeddable": true,
			"href": "http://wordpress.test/wp-json/wp/v2/tags?post=1"
		}],
		"curies": [{
			"name": "wp",
			"href": "https://api.w.org/{rel}",
			"templated": true
		}]
	}
};
