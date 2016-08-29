import app from './app';

app.listen(app.get('path'), () => {
  console.log(`app is running on port ${app.get('port')}`);
});
