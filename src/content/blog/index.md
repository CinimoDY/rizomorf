---
title: feed
description: Stream of updates, thoughts and experiments
layout: base.njk
permalink: /blog/index.html
---

<section>

> {{ post.data.date | formatDate }}  [Play Spacewar in your browser]({{ baseUrl }}/dos-games/)

{% for post in collections.blog %}
> {{ post.data.date | formatDate }} [{{ post.data.title }}]({{ baseUrl }}/blog/{{ post.fileSlug }}.html)
{% endfor %}

</section> 