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
const categoryNames = {
  1: 'Flight',
  2: 'Train',
  3: 'Bus',
  4: 'Ship'
};

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
  validateForm();
}

function showForm(formNumber) {
  // Show the selected form
  document.getElementById(`form${formNumber}`).style.display = 'block';

  // Enable or disable Next button based on form validation
  validateForm();
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

// Checkout Popup Modal for Confirmation
function submitForm(event) {
  event.preventDefault();

  // Process and submit form data
  const summaryContent = buildSummary();
  document.getElementById('summaryContent').innerHTML = summaryContent;
  openModal('summaryModal');
}

function buildSummary() {
  const form2 = document.getElementById('form2');
  const form3 = document.getElementById('form3');

  const form2Fields = form2.querySelectorAll('input, select');
  const form3Fields = form3.querySelectorAll('input');

  const summaryTable = document.createElement('table');
  summaryTable.className = 'summary-table';

  const addRow = (label, value) => {
    const row = summaryTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    cell1.innerHTML = `<strong>${label}</strong>`;
    cell2.innerHTML = ":";
    cell3.innerHTML = value;
  };

  // Selected category in summary
  addRow('Category', categoryNames[selectedCategory]);

  // Form 2
  form2Fields.forEach(field => {
    const labelElement = document.querySelector(`label[for="${field.id}"]`);
    if (labelElement) {
        const label = labelElement.innerText;
        let value = '';
        
        if (field.tagName === 'SELECT') {
            // Jika elemen adalah select, ambil nilai dari option yang dipilih
            const selectedOption = field.options[field.selectedIndex];
            value = selectedOption ? selectedOption.text : ''; // Teks dari option yang dipilih
        } else {
            // Jika elemen adalah input, ambil nilai langsung
            value = field.value;
        }
        
        addRow(label, value);
    }
  });


  // Form 3
  form3Fields.forEach(field => {
    const label = document.querySelector(`label[for="${field.id}"]`).innerText;
    addRow(label, field.value);
  });

  return summaryTable.outerHTML;
}

// Open Pop-up modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('summaryModal');
  modal.style.display = 'none';
}

function goBack() {
  closeModal();
}

function confirmForm() {
  // Perform actions when the user confirms the form
  alert('Form confirmed!');

  // Refresh page after confirm
  window.location.reload();
  closeModal();
}

function resetForm() {
  // Reset form fields when changing Category
  const formFields = document.querySelectorAll('.form-sct input');
  formFields.forEach(field => {
      field.value = '';
  });
}