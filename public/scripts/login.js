
    const loginForm = document.querySelector("#login-form")
    const registerForm = document.querySelector("#register-form")

    const title = document.querySelector("#title")
    const subtitle = document.querySelector("#subtitle")

    const switchText = document.querySelector("#switch-text")
    const switchButton = document.querySelector("#switch-button")

    let isLogin = true

    switchButton.addEventListener("click", () => {

      isLogin = !isLogin

      if (isLogin) {

        title.textContent = "Entrar"
        subtitle.textContent = "Entre para continuar conversando."

        loginForm.classList.remove("hidden")
        registerForm.classList.add("hidden")

        switchText.textContent =
          "Ainda não possui uma conta?"

        switchButton.textContent =
          "Cadastre-se"

      } else {

        title.textContent = "Criar conta"
        subtitle.textContent = "Cadastre-se para começar a conversar."

        loginForm.classList.add("hidden")
        registerForm.classList.remove("hidden")

        switchText.textContent =
          "Já possui uma conta?"

        switchButton.textContent =
          "Entrar"

      }

    })

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      const name = document.querySelector("#login-name").value
      const password = document.querySelector("#login-password").value

      const result = await requestBackend(
        'http://localhost:3000/user/login',
        'POST',
        {
          name,
          password
        }
      )

      window.location.href = "http://localhost:3000/chat";
    })

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      const name = document.querySelector("#register-name").value
      const password = document.querySelector("#register-password").value

      const result = await requestBackend(
        'http://localhost:3000/user/register',
        'POST',
        {
          name,
          password
        }
      )

      window.location.href = "http://localhost:3000/chat";
    })

    async function requestBackend (url, method, payload) {       
      try {
        const token = localStorage.getItem('access_token');

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(payload)
        })

        const result = await response.json()

        if (!response.ok) {
          const serverError = new Error(result.message || "Erro desconhecido");
          serverError.errors = result.errors;
          serverError.status = response.status;
          throw serverError;
        }

        return result

      } catch (error) {
        var erroMessage = (`[Erro ${error.status || 'Network'}]:`, error.message)
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach(err => {
            erroMessage += (`\nCampo inválido: [${err.field}] -> ${err.message}`)
          })
        }
        console.error(erroMessage)
        throw error
      }
    }
  