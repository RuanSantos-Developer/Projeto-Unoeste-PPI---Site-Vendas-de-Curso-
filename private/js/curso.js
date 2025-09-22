const formulario = document.getElementById("FormCursos");
formulario.onsubmit = gravarCurso;
mostrarTabelaCursos();

function gravarCurso(event){

if(validarFormulario()){

        const nomeCurso = document.getElementById("nome").value;
        const duracaoCurso = document.getElementById("duracao").value;
        const valorCurso = document.getElementById("preco").value;
        const instrutorCurso = document.getElementById("instrutor").value;
        const descricaoCurso = document.getElementById("descricao").value;

        console.log("Nome do Curso: " + nomeCurso);
        console.log("Duração do Curso: " + duracaoCurso);
        console.log("Valor do Curso: " + valorCurso);
        console.log("Instrutor do Curso: " + instrutorCurso);
        console.log("Descrição do Curso: " + descricaoCurso);

       fetch("http://localhost:4000/cursos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "nome": nomeCurso,
                "duracao": duracaoCurso,
                "valor": valorCurso,
                "instrutor": instrutorCurso,
                "descricao": descricaoCurso
            })
        }).then((res) => {return res.json()})
        .then((data) => {
            if(data.status){

                formulario.reset();
                mostrarTabelaCursos();
            }
             alert(data.mensagem);

        })
        .catch((error) => {
            console.error("Erro ao cadastrar curso:", error);
        });
    }
    event.stopPropagation();
    event.preventDefault();
}

function validarFormulario(){
    const formValidado = formulario.checkValidity();
    if(formValidado){

        formulario.classList.remove("was-validated");
    }
    else{
        formulario.classList.add("was-validated");
    }
    return formValidado;
}

function deletarCurso(id){
    if(confirm("Deseja realmente deletar o curso de ID " + id + "?")){
        fetch("http://localhost:4000/cursos/" + id, {
            method: "DELETE",
        }).then((res) => {return res.json()})
        .then((data) => {
            if(data.status){
                mostrarTabelaCursos();
            }
             alert(data.mensagem);
        })
        .catch((error) => {
            console.error("Erro ao deletar curso:", error);
        });
    }
}

function mostrarTabelaCursos(){
    const espacotabela = document.getElementById("tabelaCursos");
    espacotabela.innerHTML = "";

    

    fetch("http://localhost:4000/cursos", {
        method: "GET",

}).then((res) => {
    if(res.ok){
    return res.json()
    }
}).then((data) => {
    if(data.status){
    const tabela = document.createElement("table");
    tabela.className = "table table-striped table-hover";

    const cabecalho = document.createElement("thead");
    cabecalho.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Duração</th>
            <th>Valor</th>
            <th>Instrutor</th>
            <th>Descrição</th>
            <th>Ações</th>
        </tr>
    `;
    tabela.appendChild(cabecalho);

    const corpoTabela = document.createElement("tbody");
    for(const curso of data.cursos){
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nome}</td>
            <td>${curso.duracao}</td>
            <td>${curso.valor}</td>
            <td>${curso.instrutor}</td>
            <td>${curso.descricao}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deletarCurso(${curso.id})">Deletar</button>
                <button class="btn btn-warning btn-sm" onclick="editarCurso(${curso.id})">Editar</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    }
    tabela.appendChild(corpoTabela);
    espacotabela.appendChild(tabela);
    }
    })
    .catch((error) => {
        console.error("Erro ao carregar cursos:", error);
    });
}