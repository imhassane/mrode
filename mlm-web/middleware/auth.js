export default ({ store, redirect }) => {
  if(!store.state.auth.auth){
    return redirect("/comptes/connexion");
  }
}
