- all available settings are stored in './config.js'

- create user by username / password
```
mutation {
  createKsAppUser(data: {
    username: "my username",
    password: "my strong pass",
    isAdmin: true # this will be set to 'true' only if admin is logged in or user is created manually (not via request)
  }) {
    id, username, isAdmin
  }
}
```

- get all users
```
query {
  allKsAppUsers {
    id, username, isAdmin
  }
}
```

- authenticate
```
mutation {
  authenticateKsAppUserWithPassword(username: "my username", password: "my strong pass") {
    item { id, username, isAdmin }, token
  }
}
```

- unauthenticate
```
mutation {
  unauthenticateKsAppUser {
    success
  }
}
```

- get current logged in user data { id, username, token, commentsCount, numberOfLikesReceived, numberOfDislikesReceived, commentedArticles: [ { commentId, articleId, articleTitle } ] }
```
query {
  currentLoggedInUser {
    id,
    username,
    isAdmin,
    comments: comments { id, article { id, title }, created },
    likesDislikesReceived: receivedKarma { isLike }
  }
}
```

- create article
```
mutation {
  createKsAppArticle(data: {
    title: "A Long Story",
    text: "Lorem ipsum dolor sit amet"
  }) {
    id, title, text, created
  }
}
```

- get all articles
```
query {
  allKsAppArticles {
    id, title, text, created
  }
}
```

- leave a comment for article
```
mutation {
  createKsAppComment(data: {
    article: { connect: { id: "5f67633712aede3010f57a1e" } },
    text: "comment text"
  }) {
    id, article { id, title }, user { id, username }, created, text
  }
}
```

- like/dislike a comment
```
mutation {
    mergeCommentLike(commentId: "5f67b9fe8cf1af290ccf80f6", isLike: true) {
        id,
        commentId,
        isLike
    }
}
```

- like/dislike a user
```
mutation {
  mergeUserLike(recipientId:"5f67b24f004be8331cd203d7", isLike: true) {
    id,
    recipientId,
    isLike
  }
}
```

- get all comments for article { id, text, createdDate, userId, likesCount, dislikesCount }
```
query {
  allKsAppComments(where: {
    article: {
      id: "5f67633712aede3010f57a1e"
    }
  }) {
    id,
    text,
    created,
    user { id, username },
    likes: _likesMeta(where: {isLike:true}) {count},
    dislikes: _likesMeta(where: {isLike:false}) {count}
  }
}
```