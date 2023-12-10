// Integrate Front End and Back End API
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
		setupTransportation(transports);
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
			div.setAttribute("id", data.id);
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

const sendCheckout = async () => {
	const selectedTransport =
		document.querySelector(".ctgActive").dataset.value;
	const transportationId = parseInt(selectedTransport);

	const acmdValue = document.getElementById("acmd").value;
	const accommodationId = parseInt(acmdValue);

	const fromDestValue = document.getElementById("from-dst").value;
	const fromDestId = parseInt(fromDestValue);

	const toDestValue = document.getElementById("to-dst").value;
	const toDestId = parseInt(toDestValue);

	const dateValue = document.getElementById("date-input").value;
	const date = new Date(dateValue).toISOString();

	const name = document.getElementById("name").value;
	const email = document.getElementById("email").value;
	const phone = document.getElementById("phone").value;

	// send data to API
	try {
		await fetch(`${API_URL}/checkout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				transportationId,
				accommodationId,
				fromDestId,
				toDestId,
				date,
				name,
				email,
				phone,
			}),
		}).then((response) => response.json());
	} catch (error) {
		console.error("Error checkout:", error);
	}
};
