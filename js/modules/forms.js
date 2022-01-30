import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimerId) {
  //Forms
  const forms = document.querySelectorAll(formSelector);

  const message = {
    loading: "Загрузка",
    success: "Спасибо! Скоро мы с Вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  forms.forEach((item) => {
    bindpostData(item);
  });

  function bindpostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("div");
      statusMessage.classList.add("status");
      statusMessage.textContent = message.loading;
      form.append(statusMessage);

      const formData = new FormData(form);

      // const object = {};
      // formData.forEach((value, key) => {
      //   object[key] = value;
      // });

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);

          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });

      // request.addEventListener("load", () => {
      //   if (request.status === 200) {
      //     console.log(request.response);
      //     showThanksModal(message.success);
      //     form.reset();
      //     statusMessage.remove();
      //   } else {
      //     showThanksModal(message.failure);
      //   }
      // });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");

    prevModalDialog.style.display = "none";
    openModal(".modal", modalTimerId);

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
     <div class="modal__content">
       <div class="modal__close" data-close>x</div>
       <div class="modal__title">${message}</div>
     </div>
   `;

    document.querySelector(".modal").append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.style.display = "block";
      closeModal(".modal");
    }, 4000);
  }

  fetch("db.json").then((data) => data.json());
  // .then((res) => console.log(res));
}

export default forms;
