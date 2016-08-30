import BooksController from '../controllers/books';

export default (app,Books) => {
app.route('/books')
  .get((req, res) => {
    Books.findAll({})
      .then(result => { res.json(result); })
      .catch(() => { res.status(412); });
  })
  .post((req, res) => {
    Books.create(req.body)
      .then(result => res.json(result))
      .catch(() => res.status(412));
  });

app.route('/books/:id')
  .get((req, res) => {
    Books.findOne({ where: req.params })
      .then(result => { res.json(result); })
      .catch(() => { res.status(412); });
  })
  .put((req, res) => {
    Books.update(req.body, { where: req.params })
      .then(result => { res.json(result); })
      .catch(() => { res.status(412); });
  })
  .delete((req, res) => {
    Books.destroy({ where: req.params })
      .then(() => { res.sendStatus(204); })
      .catch(() => { res.status(412); });
  });
}
