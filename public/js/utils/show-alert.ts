export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) {
    el.parentElement?.removeChild(el);
  }
};

export const showAlert = (type: string, msg: string, time: number) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}"> ${msg} </div> `;

  const body = document.querySelector("body");

  if (body) {
    body.insertAdjacentHTML("afterbegin", markup);
    window.setTimeout(hideAlert, time * 1000);
  }
};
