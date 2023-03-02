//variable
const form = document.querySelector('#expense-added');
const expenseList = document.querySelector('#expense ul');


//events
eventListerners();
function eventListerners() {
    document.addEventListener('DOMContentLoaded', askBudget );
    form.addEventListener('submit', addExpenses);
}

//classes
class Budget {
    constructor(budget){
        this.budget = Number(budget);
        this.remainder  = Number(budget);
        this.bills = [];
    }

    newExpense(expense) {
        this.bills = [...this.bills, expense];
        this.calculateRemainder();
    }

    calculateRemainder() {
        const spent = this.bills.reduce((total, spent) => total + spent.amountBill, 0);
        this.remainder = this.budget - spent;

    }

    deleteSpent(id) {
        this.bills = this.bills.filter(bill => bill.id != id);
        this.calculateRemainder();
    }

}

class UI { //class user interface
    insertBudget(amount) { //receive an object
        const { budget, remainder } = amount;
        document.querySelector('#total').textContent = budget; //add in HTML
        document.querySelector('#remaining').textContent = remainder;
    }

    showAlert(message, typeMessage) {
        const divMessage = document.createElement('div');
        divMessage.classList.add('alert');

        if(typeMessage === 'error'){
            divMessage.classList.add('alert-danger');
        }else{
            divMessage.classList.add('alert-success');
        }

        //message error
        divMessage.textContent = message;
        document.querySelector('.primary-content').insertBefore(divMessage, form );
        setTimeout(() => {
            divMessage.remove(); //delete div
        }, 3000);
    }

    addToList( bills ) {
        this.cleanHTML();
        //loop of bills
        bills.forEach(bill => {
            const {amountBill, id, nameBill} = bill;

            const newBill = document.createElement('li');
             newBill.className = 'bill'; //nombramos clases
             newBill.dataset.id = id; //to HTML

             //add in HTML
             newBill.innerHTML = `${nameBill} <span>$ ${amountBill} </span>`;

             //button to delete
             const btnDelete = document.createElement('button');
             btnDelete.classList.add('btn-delete');
             btnDelete.innerHTML = 'Delete X';
             btnDelete.onclick = () => {
                deleteSpent(id);
             }
             newBill.appendChild(btnDelete);

             expenseList.appendChild(newBill);
        })
    }

    cleanHTML() {
        while(expenseList.firstChild){
            expenseList.removeChild(expenseList.firstChild);
        }
    }

    updateRemainder(remainder) {
        document.querySelector('#remaining').textContent = remainder;
    }

    consultBudget(BudgetObj) {
        const {budget, remainder} = BudgetObj;
        const remainderDiv = document.querySelector('.consult-budget');
        
        if((budget / 4) > remainder){
            remainderDiv.classList.remove('secundary-field');
            remainderDiv.classList.remove('careful-field');
            remainderDiv.classList.add('danger-field');
        }else if((budget / 2) > remainder){
            remainderDiv.classList.remove('secundary-field');
            remainderDiv.classList.add('careful-field');
        }else {
            remainderDiv.classList.remove('careful-field');
            remainderDiv.classList.remove('danger-field');
            remainderDiv.classList.add('secundary-field');
        }

        if(remainder <= 0){
            ui.showAlert('budget has been exhausted', 'error');
            form.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

const ui = new UI(); //global
let validBudget; //global


//funtions
function askBudget() {
    const budgetUser = prompt('What is your budget');
    if(budgetUser === '' || budgetUser === null || isNaN(budgetUser) || budgetUser <= 0){
        window.location.reload();
    }
    validBudget = new Budget(budgetUser);
    ui.insertBudget(validBudget);
    
}

function addExpenses(e) {
    e.preventDefault();

    const nameBill = document.querySelector('#bill').value;
    const amountBill = Number(document.querySelector('#amonut').value); //parse Number

    if(nameBill === '' || amountBill === ''){
        ui.showAlert('Both fields are requied', 'error');
        return;
    }else if(amountBill <= 0 || isNaN(amountBill)) { //isNaN to Strings
        ui.showAlert('The amount is invalid', 'error');
        return;
    }

    //object literraly
    const wholeBill = {nameBill, amountBill, id: Date.now()};
    //add new expense
    validBudget.newExpense(wholeBill);
    ui.showAlert('expense added correctly');
    //destructuring 
    const {bills, remainder} = validBudget;

    ui.addToList(bills);
    ui.updateRemainder(remainder);
    ui.consultBudget(validBudget);

    form.reset();
}

function deleteSpent(id) {
    validBudget.deleteSpent(id);

    const {bills, remainder} = validBudget;
    ui.addToList(bills);
    ui.updateRemainder(remainder);
    ui.consultBudget(validBudget);
}