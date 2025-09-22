export default function verificarAutenticado(req, res, next) {
  if (req?.session?.autenticado) {
     next();
  } else {
    res.redirect("/login.html");
  }
}
