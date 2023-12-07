// Burger navbar responsive design
const bar = document.getElementById("bar");
const closeNav = document.getElementById("closeNav");
const nav = document.getElementById("navbar");

if (bar) {
	bar.addEventListener("click", () => {
		nav.classList.add("active");
	});
}

if (closeNav) {
	closeNav.addEventListener("click", () => {
		nav.classList.remove("active");
	});
}

document.onclick = function (closeBar) {
	if (closeBar.target.id !== "navbar" && closeBar.target.id !== "bar") {
		nav.classList.remove("active");
		bar.classList.remove("active");
	}
};

// Navbar link on page scroll
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
	let scrollY = window.pageYOffset;

	sections.forEach((current) => {
		const sectionHeight = current.offsetHeight;
		const sectionTop = current.offsetTop - 5;
		sectionId = current.getAttribute("id");

		if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
			document
				.querySelector(".navigation a[href*=" + sectionId + "]")
				.classList.add("active");
		} else {
			document
				.querySelector(".navigation a[href*=" + sectionId + "]")
				.classList.remove("active");
		}
	});
}

// Progresive Book form section
let selectedCategory = 0;

async function selectCategory(transportationId) {
	// Reset the form fields when switching categories
	resetForm();

	// Highlight selected category
	selectedCategory = parseInt(transportationId);

	const categories = document.querySelectorAll(".category");
	categories.forEach((transport) => transport.classList.remove("ctgActive"));
	document
		.querySelector(`[data-value="${transportationId}"]`)
		.classList.add("ctgActive");
	// Show Form step 2
	showForm(2);

	// Enable or disable Next button based on form validation
	validateForm();

	// Sync with choosen transportation
	await loadAccommodation(transportationId);
}

function showForm(formNumber) {
	// Show the selected form
	document.getElementById(`form${formNumber}`).style.display = "block";

	// Enable or disable Next button based on form validation
	validateForm();
}

// Button Statement on Book Section
function validateForm() {
	const form2Fields = document
		.getElementById("form2")
		.querySelectorAll("input");
	const form3Fields = document
		.getElementById("form3")
		.querySelectorAll("input");

	const nextButton = document.querySelector("#form2 button");
	const submitButton = document.querySelector("#form3 button");

	// Check if all form fields are filled
	const form2Complete = Array.from(form2Fields).every(
		(field) => field.value.trim() !== ""
	);
	const form3Complete = Array.from(form3Fields).every(
		(field) => field.value.trim() !== ""
	);

	// Enable or disabled Next Button on form step 2
	if (form2Complete) {
		nextButton.removeAttribute("disabled");
	} else {
		nextButton.setAttribute("disabled", "true");
	}

	// Enable or disabled Submit Button on form step 3
	if (form3Complete) {
		submitButton.removeAttribute("disabled");
	} else {
		submitButton.setAttribute("disabled", "true");
	}
}

// Add event listeners to form fields for real-time validation
document.querySelectorAll("input").forEach((input) => {
	input.addEventListener("input", validateForm);
});

// Checkout Popup Modal for Confirmation
function submitForm(event) {
	event.preventDefault();

	// Process and submit form data
	const summaryContent = buildSummary();
	document.getElementById("summaryContent").innerHTML = summaryContent;
	openModal("summaryModal");
}

function buildSummary() {
	const form2 = document.getElementById("form2");
	const form3 = document.getElementById("form3");

	const form2Fields = form2.querySelectorAll("input, select");
	const form3Fields = form3.querySelectorAll("input");

	const summaryTable = document.createElement("table");
	summaryTable.className = "summary-table";

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
	const selectedCategory = document.querySelector(".ctgActive");
	console.log(selectedCategory);
	const nameCategory = selectedCategory.querySelector("p p")
	console.log(nameCategory);
	addRow("Category", nameCategory.innerHTML);

	// Form 2
	form2Fields.forEach((field) => {
		const labelElement = document.querySelector(`label[for="${field.id}"]`);
		if (labelElement) {
			const label = labelElement.innerText;
			let value = "";

			if (field.tagName === "SELECT") {
				// Jika elemen adalah select, ambil nilai dari option yang dipilih
				const selectedOption = field.options[field.selectedIndex];
				value = selectedOption ? selectedOption.text : ""; // Teks dari option yang dipilih
			} else {
				// Jika elemen adalah input, ambil nilai langsung
				value = field.value;
			}

			addRow(label, value);
		}
	});

	// Form 3
	form3Fields.forEach((field) => {
		const label = document.querySelector(
			`label[for="${field.id}"]`
		).innerText;
		addRow(label, field.value);
	});

	return summaryTable.outerHTML;
}

// Open Pop-up modal
function openModal(modalId) {
	const modal = document.getElementById(modalId);
	modal.style.display = "flex";
}

function closeModal() {
	const modal = document.getElementById("summaryModal");
	modal.style.display = "none";
}

function goBack() {
	closeModal();
}

function confirmForm() {
	const summaryContent = document.getElementById("summaryContent");
	const loadingContainer = document.getElementById("loadingContainer");
	const successIcon = document.getElementById("successIcon");
	const backButton = document.getElementById("backButton");
	const confirmButton = document.getElementById("confirmButton");

	backButton.style.display = "none";
	confirmButton.style.display = "none";

	summaryContent.style.display = "none";
	loadingContainer.style.display = "flex";

	setTimeout(() => {
		loadingContainer.style.display = "none";
		successIcon.style.display = "block";

		backButton.style.display = "inline-block";
		confirmButton.style.display = "inline-block";

		setTimeout(() => {
			window.location.reload();
			closeModal();

			summaryContent.style.display = "block";
			successIcon.style.display = "none";
		}, 2000);
	}, 5000);
}

function resetForm() {
	// Reset form fields when changing Category
	const formFields = document.querySelectorAll(".form-sct input");
	formFields.forEach((field) => {
		field.value = "";
	});
}

// Integrate Front End with Back End API
// const API_URL = "http://localhost:3000";
const API_URL = "https://be-2-bandung-8-production.up.railway.app";

document.addEventListener("DOMContentLoaded", () => {
	fetchTransportation();
	getDestination();
});

// Get Transportation data
const fetchTransportation = async () => {
	try {
		const response = await fetch(`${API_URL}/transport`);
		const transports = await response.json();
		console.log(transports);
		setupTransportation(transports);
		categoryNames(transports);
	} catch (error) {
		console.error("Error:", error);
	}
};

const setupTransportation = async (transports) => {
	try {
		const section = document.getElementById("transport");
		transports.forEach((data) => {
			const div = document.createElement("div");
			div.classList.add("category", "icon-transport");
			div.setAttribute("data-value", data.id);
			div.setAttribute("id", data.type);
			div.setAttribute("onclick", `selectCategory(${data.id})`);

			const button = document.createElement("button");
			button.setAttribute("id", data.type);

			const img = document.createElement("img");
			img.setAttribute("src", `${data.iconUrl}`);
			img.classList.add("ic", "fe-box");
			img.setAttribute("alt", data.type);

			const p = document.createElement("p");
			p.innerHTML = `
			<p>${data.type}</p>
			`;

			button.appendChild(img);
			button.appendChild(p);
			div.appendChild(button);
			section.appendChild(div);
		});
	} catch (error) {
		console.error("Error:", error);
	}
};

// Get Accommodation Data
const loadAccommodation = async (transportationId) => {
	try {
		const response = await fetch(
			`${API_URL}/accommodation/${transportationId}`
		);
		const accommodations = await response.json();
		console.log(accommodations);

		const selector = document.getElementById("acmd");
		selector.innerHTML = `<option value="" disabled selected>Choose accommodation</option>`;

		accommodations.forEach((acmd) => {
			const option = document.createElement("option");
			option.value = acmd.id;
			option.textContent = acmd.name;
			selector.appendChild(option);
		});
	} catch (error) {
		console.error(error);
	}
};

const accommodationPrice = async (transportationId) => {
	const acmdSelect = document.getElementById("acmd");
	const accommodationId = acmdSelect.value;

	if (accommodationId) {
		await fetch(
			`${API_URL}/accommodation/${transportationId}/${accommodationId}`
		)
			.then((response) => response.json())
			.then((accommodation) => {
				const acmdPrice = document.getElementById("acmdPrice");
				if (acmdPrice) {
					acmdPrice.textContent = `Rp ${accommodation.price},-`;
				} else {
					acmdPrice.textContent = `Rp 0,-`;
				}
			});
	}
};

const acmdSelect = document.getElementById("acmd");
acmdSelect.addEventListener("change", accommodationPrice);

// Get Destination data
const getDestination = async () => {
	try {
		const response = await fetch(`${API_URL}/destination`);
		const destinations = await response.json();
		console.log(destinations);
		displayDestinationFrom(destinations);
		displayDestinationTo(destinations);
	} catch (error) {
		console.error("Error:", error);
	}
};

function displayDestinationFrom(destinations) {
	const selector = document.getElementById("from-dst");
	selector.innerHTML = `<option value="" disabled selected>Initial location</option>`;

	destinations.forEach((dest) => {
		const option = document.createElement("option");
		option.value = dest.id;
		option.textContent = dest.name;
		selector.appendChild(option);
	});
}

function displayDestinationTo(destinations) {
	const selector = document.getElementById("to-dst");
	selector.innerHTML = `<option value="" disabled selected>Your destination</option>`;

	destinations.forEach((dest) => {
		const option = document.createElement("option");
		option.value = dest.id;
		option.textContent = dest.name;
		selector.appendChild(option);
	});
}

