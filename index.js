//importações
import express from "express";
import session from "express-session";
import verificarAutenticado from "./seguranca/autenticar.js";


const app = express();
const PORT = 3000;
const host = '0.0.0.0'

// Configuração do body-parser
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(
  session({
    secret: "segredo_super_secreto",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 15 // 15minutos
    }
  })
);

// Configuração para servir arquivos estáticos

// Login
app.post("/login", (req, res) => {
  const usuario = req.body.usuario;
  const senha = req.body.senha;

  if (usuario === "admin" && senha === "admin") {
    req.session.autenticado = true;
    res.redirect("/menu.html");
  } else {
    res.redirect("/login.html");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send("Erro ao fazer logout.");
    }
    res.redirect("/index.html"); 
  });
});



app.use(express.static("public"));
app.use(verificarAutenticado, express.static("private"));


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}${host}`);
});
