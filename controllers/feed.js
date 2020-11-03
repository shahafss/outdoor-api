exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "First Postaa", content: "This is the first postaa!" }],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // create post in db
  res.status(201).json({
    message: "Post Created successfully!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
