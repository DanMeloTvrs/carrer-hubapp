// Conversa com o Firebase: login e banco de dados na nuvem.
// Este arquivo é um "módulo", por isso o app precisa abrir pelo Live Server
// (ou publicado na internet), e não clicando duas vezes no index.html.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const app = initializeApp(window.FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

// Cada save vira um documento em: usuarios / (seu id) / saves / (id do save)
function colecaoDeSaves() {
  return collection(db, "usuarios", auth.currentUser.uid, "saves");
}

function documentoDoSave(id) {
  return doc(db, "usuarios", auth.currentUser.uid, "saves", String(id));
}

window.Nuvem = {
  usuario: function () {
    return auth.currentUser;
  },

  entrar: function (email, senha) {
    return signInWithEmailAndPassword(auth, email, senha);
  },

  criarConta: function (email, senha) {
    return createUserWithEmailAndPassword(auth, email, senha);
  },

  recuperarSenha: function (email) {
    return sendPasswordResetEmail(auth, email);
  },

  sair: function () {
    return signOut(auth);
  },

  carregarSaves: async function () {
    const resultado = await getDocs(colecaoDeSaves());
    const lista = [];
    resultado.forEach(function (documento) {
      lista.push(documento.data());
    });
    lista.sort(function (a, b) {
      return a.id - b.id;
    });
    return lista;
  },

  enviarSave: function (save) {
    return setDoc(documentoDoSave(save.id), save);
  },

  apagarSave: function (id) {
    return deleteDoc(documentoDoSave(id));
  }
};

// Avisa o app sempre que alguém entra ou sai
onAuthStateChanged(auth, function (usuario) {
  if (window.aoMudarLogin) window.aoMudarLogin(usuario);
});