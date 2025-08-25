//importações
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Ajuste para __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const host = '0.0.0.0'

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.use(express.static(path.join(__dirname, "public")));

// Middleware de autenticação
function autenticar(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  res.redirect("/login.html");
}

// Login
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === "admin" && senha === "123") {
    req.session.usuario = usuario;
    return res.redirect("/index.html");
  }

  res.send("Usuário ou senha inválidos");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send("Erro ao fazer logout.");
    }
    res.redirect("/index.html"); // volta pro index
  });
});

// Cursos protegidos
app.get("/cursos/:id", autenticar, (req, res) => {
  const cursoId = req.params.id;
  res.sendFile(path.join(__dirname, "private", `curso${cursoId}.html`));
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}${host}`);
});
