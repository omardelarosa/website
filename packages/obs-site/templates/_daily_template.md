---
created: <% tp.file.creation_date("X") %>
lastTouched: <% tp.file.last_modified_date("X") %>
---

tags:: [[+Daily Notes]]

Created: **<% moment(tp.file.title,'YYYY-MM-DD').format("dddd, MMMM DD, YYYY") %>**

<< [[daily/<% tp.date.now("YYYY", -1) %>/<% tp.date.now("MM", -1) %>/<% tp.date.now("YYYY-MM-DD", -1) %>|Yesterday]] | [[daily/<% tp.date.now("YYYY", 1) %>/<% tp.date.now("MM", 1) %>/<% tp.date.now("YYYY-MM-DD", 1) %>|Tomorrow]] >>

---

... body of the daily note ...

---

### Notes created today

```dataview
List FROM "" WHERE file.cday = date("<%tp.date.now("YYYY-MM-DD")%>") SORT file.ctime asc
```

### Notes last touched today

```dataview
List FROM "" WHERE file.mday = date("<%tp.date.now("YYYY-MM-DD")%>") SORT file.mtime asc
```
