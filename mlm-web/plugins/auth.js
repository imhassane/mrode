export default function(ctx, inject) {
  inject('auth', ctx.store.state.auth);
}
