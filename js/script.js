// Burger navbar responsive design
const bar = document.getElementById('bar');
const closeNav = document.getElementById('closeNav');
const nav = document.getElementById('navbar');

if (bar) {
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  })
}

if (closeNav) {
  closeNav.addEventListener('click', () => {
    nav.classList.remove('active');
  })
}

document.onclick = function(closeBar) {
  if(closeBar.target.id !== 'navbar' && closeBar.target.id !== 'bar') {
    nav.classList.remove('active');
    bar.classList.remove('active');
  }
}

// Navbar link on page scroll
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
  let scrollY = window.pageYOffset;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 5;
    sectionId = current.getAttribute("id");
    
    if (
      scrollY > sectionTop &&
      scrollY <= sectionTop + sectionHeight
    ) {
      document.querySelector(".navigation a[href*=" + sectionId + "]").classList.add("active");
    } else {
      document.querySelector(".navigation a[href*=" + sectionId + "]").classList.remove("active");
    }
  });
}

// Progresive Book form section
let selectedCategory = 0;
const categories = document.querySelectorAll('.category');

function selectCategory(category) {

  // Reset the form fields when switching categories
  resetForm();

  selectedCategory = category;

  // Highlight selected category
  categories.forEach((transport) => transport.classList.remove('ctgActive'));
  categories[category-1].classList.add('ctgActive');

  // Show Form step 2
  showForm(2);

  // Enable or disable Next button based on form validation
  validateform();
}

function showForm(formNumber) {
  // Show the selected form
  document.getElementById(`form${formNumber}`).style.display = 'block';

  // Enable or disable Next button based on form validation
  validateform();
}

// Button Statement on Book Section
function validateForm() {
  const form2Fields = document.getElementById('form2').querySelectorAll('input');
  const form3Fields = document.getElementById('form3').querySelectorAll('input');

  const nextButton = document.querySelector('#form2 button');
  const submitButton = document.querySelector('#form3 button');

  // Check if all form fields are filled
  const form2Complete = Array.from(form2Fields).every(field => field.value.trim() !== '');
  const form3Complete = Array.from(form3Fields).every(field => field.value.trim() !== '');

  // Enable or disabled Next Button on form step 2
  if (form2Complete) {
    nextButton.removeAttribute('disabled');
  } else {
    nextButton.setAttribute('disabled', 'true');
  }

  // Enable or disabled Submit Button on form step 3
  if (form3Complete) {
    submitButton.removeAttribute('disabled');
  } else {
    submitButton.setAttribute('disabled', 'true');
  }
}

// Add event listeners to form fields for real-time validation
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', validateForm);
});

// document.querySelectorAll('#form3 input').forEach(input => {
//   input.addEventListener('input', validateForm);
// });

// function submitForm() {
//   Process and submit form data
//   alert('Form submitted!')
// }

function resetForm() {
  // Reset form fields when changing Category
  const formFields = document.querySelectorAll('.form-sct input');
  formFields.forEach(field => {
      field.value = '';
  });
}