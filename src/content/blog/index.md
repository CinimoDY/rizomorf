---
title: feed
description: Stream of updates, thoughts and experiments
layout: base.njk
permalink: /blog/index.html
---

# feed

<section>

## updates

> 2024-01-19 [Play Spacewar in your browser]({{ baseUrl }}/dos-games/) - Classic DOS game now playable on modern devices

{% for post in collections.blog %}
> {{ post.data.date | formatDate }} [{{ post.data.title }}]({{ baseUrl }}/blog/{{ post.fileSlug }}.html)
{% endfor %}

</section> 