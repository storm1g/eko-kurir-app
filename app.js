// Delivery Class: Represents a Delivery
class Delivery {
  constructor(sender, recipient, price) {
    this.sender = sender;
    this.recipient = recipient;
    this.price = price;
    this.id = String(Date.now());
  }
}

// UI Class: Handles UI Tasks
class UI {
  static displayDeliveries() {
    const deliveries = Store.getDeliveries();

    deliveries.forEach((delivery) => UI.addDeliveryToList(delivery));
    console.log(deliveries);
  }

  static addDeliveryToList(delivery) {
    const list = document.querySelector('#delivery-list');

    const row = document.createElement('tr');
    row.classList.add('book-row');
    row.dataset.id = delivery.id;

    row.innerHTML = `
      <td>${delivery.sender}</td>
      <td>${delivery.recipient}</td>
      <td class="price">${delivery.price}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete" data-id="${delivery.id}"><i class="fas fa-times"></i></a></td>
      <td><a href="#" class="btn btn-success btn-sm complete"><i class="fas fa-check"></i></a></td>
    `;

    list.appendChild(row);
  }

  static deleteDelivery(el) {
    const id = el.dataset.id;
    document.querySelector(`.book-row[data-id="${id}"]`).remove();
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#delivery-form');
    container.insertBefore(div, form);

    // Vanish after 1 second
    setTimeout(() => document.querySelector('.alert').remove(), 1000);
  }

  static clearForm() {
    document.getElementById("delivery-form").reset();
  }
}

// Store Class: Handles Storage
class Store {
  static getDeliveries() {
    let deliveries, storage;
    storage = localStorage.getItem('deliveries');

    if(storage === null) {
      deliveries = [];
    } else {
      deliveries = JSON.parse(storage);
    }

    return deliveries;
  }

  static addDelivery(delivery) {
    const deliveries = Store.getDeliveries();

    deliveries.push(delivery);

    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }

  static removeDelivery(id) {
    const deliveries = Store.getDeliveries();

    deliveries.forEach((delivery, index) => {
      if(delivery.id === id) {
        deliveries.splice(index, 1);
      }
    });

    localStorage.setItem('deliveries', JSON.stringify(deliveries));
    
  }
}

class Utility {
  static CalculatePriceTotal() {
    const prices = document.querySelectorAll('td.price')
    let priceTotal = 0;

    prices.forEach((cena) => {
      priceTotal += Number(cena.textContent);
    });
    console.log(priceTotal);
  }
}

// Event: Display Deliveries
document.addEventListener('DOMContentLoaded', UI.displayDeliveries);

// Event: Add Delivery
document.querySelector('#delivery-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();
  
  //  Get form values
  const sender = document.querySelector('#sender').value;
  const recipient = document.querySelector('#recipient').value;
  const price = document.querySelector('#price').value;

  // Validation
  if(sender === '' || recipient === '' || price === '') {
    UI.showAlert('Niste popunili sva polja', 'danger');
  } else {
    // Instatiate a delivery
    const delivery = new Delivery(sender, recipient, price);

    // Add Delivery to UI
    UI.addDeliveryToList(delivery);

    // Add Delivery to Store
    Store.addDelivery(delivery);

    // Show success message
    UI.showAlert('Dostava dodata', 'success');

    // Clear form fields
    UI.clearForm();
  }

});

// Event: Remove delivery
document.querySelector('#delivery-list').addEventListener('click', (e) => {
  const classes = e.target.classList;

  if (classes.contains('delete')) {
    UI.deleteDelivery(e.target);

    // Remove delivery from store
    Store.removeDelivery(e.target.dataset.id);

    // Show success message
    UI.showAlert('Dostava obrisana', 'success');
  } else if (classes.contains('complete')){
    // Add "done" class to the row element so the delivery gets marked as completed
    e.target.parentNode.parentNode.classList.toggle("done");
  } else if (classes.contains('price')){
    // Cross out the price so the user knows the delivery price has been paid
    e.target.style.textDecoration = "line-through";
  }
})