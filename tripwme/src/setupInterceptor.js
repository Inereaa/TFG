
const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const [resource, config] = args;
  const response = await originalFetch(...args);

  // si la petición es para login o registro NO se hace el redirect
  if (response.status === 401 && !resource.includes("/api/usuarios/login") && !resource.includes("/api/usuarios")) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return response;
};
