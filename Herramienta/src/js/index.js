// El codigo fue construido en apoyo de Github copilot, ademas de eso
// use como apoyo mis codigos de actividades pasadas.

// Variables Globales
const DATA_PATH = './src/data/archive/Emoji Diet Nutritional Data (g) - EmojiFoods (g).csv';
const FOOD_AMOUNT_ALLOWED = 5;
let COLORS = ['#FF7F00', '#FF7F00', '#FF7F00', '#FF7F00', '#FF7F00'];
const MIN_GRAMS = 1;
const MAX_GRAMS = 1000;
let FOOD_CHAR = 'Calories (kcal)';
const MAX_STRING_LENGTH = 9;
// Dimensiones graph
const width = 800;
const height = 600;
const margin = {
    top: 60,
    bottom: 50,
    right: 10,
    left: 60,
};

let SELECTED_FOOD = [];

// HTML components
const first_task_div = d3.select('#first-task');
const second_task_div = d3.select('#second-task');
const third_task_div = d3.select('#third-task');

const layers = d3.select("#layer-card")
const graph = third_task_div
    .append("svg")
    .attr("id", "svg_graph")
    .attr("width", width)
    .attr("height", height);

// Componentes Graficos
const contenedorBarras = graph
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorEjeY = graph
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const contenedorEjeX = graph
    .append("g")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`);

//append title
graph
    .append("text")
    .attr("x", (width) / 2)
    .attr("y", 30)
    .attr("id", "graph-title")
    .attr("text-anchor", "middle")
    .text(`${FOOD_CHAR} consumido`)
    .style("fill", "black")
    .style("font-size", 28);

//append legends
graph
    .append("text")
    .attr("x", (width) / 2)
    .attr("y", (height))
    .attr("text-anchor", "middle")
    .text("Consumibles")
    .style("fill", "black")
    .style("font-size", 15);

graph
    .append("text")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("id", "graph-yLeyend")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text(`${FOOD_CHAR}`)
    .style("fill", "black")
    .style("font-size", 15);


// Usefull functions first task

// is SELECTED_FOOD on its limit -> return boolean
function isSelectedFoodOnLimit() {
    return SELECTED_FOOD.length >= FOOD_AMOUNT_ALLOWED;
}

// is food in SELECTED_FOOD -> return boolean
function isFoodInSelectedFood(foodName) {
    return SELECTED_FOOD.some(item => item.name === foodName);
}

// add food to SELECTED_FOOD
function addFoodToSelectedFood(food, amount) {
    let foodName = food.name;

    if (isFoodInSelectedFood(foodName)) {
        let index = SELECTED_FOOD.findIndex(item => item.name === foodName);
        SELECTED_FOOD[index].amount = amount;
    } else if (!isSelectedFoodOnLimit()) {
        let color = COLORS[0];
        COLORS.splice(0, 1);
        SELECTED_FOOD.push({
            food,
            amount: amount,
            name: food.name,
            color
        });
    }

    updateLayer(SELECTED_FOOD);
    thirdTaskManager();
    updateSelectedCharInfo();
}

// is aomunt between MIN_GRAMS and MAX_GRAMS -> return boolean
function isAmountBetweenMinAndMax(amount) {
    return amount >= MIN_GRAMS && amount <= MAX_GRAMS;
}

// raise pop up message if input is not amount between MIN_GRAMS and MAX_GRAMS
function BadAmountMessage(amount) {
    if (!isAmountBetweenMinAndMax(amount)) {
        alert('The amount must be between ' + MIN_GRAMS + ' and ' + MAX_GRAMS + ' grams.');
    }
}

// if food is in SELECTED_FOOD change add-food button text to 'Actualizar'
// else change add-food button text to 'Agregar'
// si SELECTED_FOOD esta lleno, cambiar disable button solo para agregar
function updateAddFoodButton(food) {
    let add_food_button = first_task_div.select('#add-food');
    let foodName = food.name;

    if (isSelectedFoodOnLimit() && !isFoodInSelectedFood(foodName)) {
        add_food_button.attr('hidden', true);
        add_food_button.attr('disabled', 'disabled');
    } else {
        add_food_button.attr('hidden', null);
        add_food_button.attr('disabled', null);
    }

    if (isFoodInSelectedFood(foodName)) {
        add_food_button.text('Actualizar');
    } else {
        add_food_button.text('Agregar');
    }

    add_food_button
        .on('click', function () {
            // Get amount
            let amount = first_task_div.select('#amount').property('value');

            // Raise pop up message if amount is not between MIN_GRAMS and MAX_GRAMS
            BadAmountMessage(amount);

            if (isAmountBetweenMinAndMax(amount)) {
                // Add food to SELECTED_FOOD
                addFoodToSelectedFood(food, amount);

                // Update remove-food button
                updateRemoveFoodButton(food);

                // Update add-food button
                updateAddFoodButton(food);

                // Call Second Task
                //secondTaskManager(SELECTED_FOOD);
            }

        });

}

function removeFoodFromSelectedFood(foodName) {
    let index = SELECTED_FOOD.findIndex(item => item.name === foodName);
    let color = SELECTED_FOOD[index].color;
    COLORS.push(color);
    SELECTED_FOOD.splice(index, 1);
    updateLayer(SELECTED_FOOD);
    thirdTaskManager();
    updateSelectedCharInfo();
}

function updateRemoveFoodButton(food) {
    let remove_food_button = first_task_div.select('#remove-food');
    let foodName = food.name;

    if (isFoodInSelectedFood(foodName)) {
        remove_food_button.attr('disabled', null).attr("hidden", null)
            .on('click', function () {
                removeFoodFromSelectedFood(foodName);
                updateRemoveFoodButton(food);
                updateAddFoodButton(food);
            });
    } else {
        remove_food_button.attr('disabled', 'disabled').attr("hidden", "hidden");
    }
}

// Actualizar valor input a 1 si la comida no esta en SelectedFood,
// si la comida esta en SelectedFood actualizar el valor a la cantidad de la comida
function checkInputAmount(food) {
    let foodName = food.name;
    let amount = first_task_div.select('#amount').property('value');

    if (isFoodInSelectedFood(foodName)) {
        amount = SELECTED_FOOD.find(item => item.name === foodName).amount;
    } else {
        amount = 1;
    }

    first_task_div.select('#amount').property('value', amount);
}


function updateLayer(foodList) {
    layers
        .selectAll('div')
        .data(foodList, d => d.name)
        .join(
            (enter) => {
                let entered = enter.append('div')
                    .attr('class', 'item');
                entered.append('svg')
                    .attr('width', '25px')
                    .attr('height', '25px')
                    .append('rect')
                    .attr('width', '25px')
                    .attr('height', '25px')
                    .style('fill', d => d.color);
                entered.append('p')
                    .attr('class', 'name')
                    .text(d => d.name);
                entered.append('p')
                    .attr('class', 'amount')
                    .text(d => `${d.amount} g.`);
                entered.append('span')
                    .text(d => d.food?.emoji);
                entered
                    .on("click", (_, d) => {
                        document.getElementById(`food`)
                            .querySelector("option[value='" + d.name + "']").selected = true;
                        document.getElementById(`food`).dispatchEvent(new Event("change"));
                    });
                entered.transition().duration(500).style('opacity', 1).selection();
            },
            (update) => {
                update.select('p.amount').text(d => `${d.amount} g.`);
                update.transition().duration(500).style('opacity', 1).selection();
            },
            (exit) => {
                exit.transition().duration(500).style('opacity', 0).remove();
            }
        )
}

// Initial Load
async function initialLoad() {

    const alimentos = await d3.csv(DATA_PATH);

    return { alimentos };
}

// First Task
const firstTaskManager = (alimentos) => {

    // Append food options to select
    first_task_div.select('#food')
        .append("option")
        .attr("disabled", true)
        .attr("hidden", true)
        .text("Consumibles");

    first_task_div.select('#food')
        .selectAll('option')
        .data(alimentos, (_, i) => i)
        .enter()
        .append('option')
        .attr('value', d => d.name)
        .attr('id', (d, i) => `${i}-${d.name}`)
        .attr('list-idx', (_, i) => i)
        .attr('class', 'food-option')
        .attr('emoji', d => d.emoji)
        .text(d => d.name);

    first_task_div.select('#amount-leyend').attr("hidden", true);
    // Append attr to amount input
    first_task_div.select('#amount')
        .attr('min', MIN_GRAMS)
        .attr('max', MAX_GRAMS)
        .attr('step', 0.1)
        .attr("disabled", true)
        .attr("hidden", true)
        .attr('value', MIN_GRAMS);

    // Append attr to buttons
    first_task_div.select('#add-food')
        .attr('disabled', true)
        .attr("hidden", true)
        .attr('class', 'btn btn-primary');

    first_task_div.select('#remove-food')
        .attr('disabled', true)
        .attr("hidden", true)
        .attr('class', 'btn btn-danger')
        .text('Eliminar');

    // Add event listener to select
    first_task_div.select('#food')
        .on('change', function () {

            // Checked option
            let option = d3.select(this).select('option:checked');

            // Get food item from alimentos
            let food = alimentos[option.attr('list-idx')];

            // Span food emoji
            let emoji = food.emoji;
            first_task_div.select('#food-emoji').text(emoji);

            //Show amount input
            first_task_div.select('#amount')
                .attr("disabled", null)
                .attr("hidden", null);

            first_task_div.select('#amount-leyend').attr("hidden", null);

            //Show buttons
            first_task_div.select('#add-food')
                .attr("hidden", null);

            checkInputAmount(food);

            // Update add-food button text
            updateAddFoodButton(food);

            updateRemoveFoodButton(food);
        });
}

// Escala discreta con dominio entre MIN_GRAMS y MAX_GRAMS
const scaleDiscrete = d3.scaleQuantize()
    .domain([MIN_GRAMS, MAX_GRAMS])
    .range(d3.range(20, 50, 5));

const totalFoodChar = () => {
    let total = 0;
    SELECTED_FOOD.forEach(food => {
        total += food.amount * food.food[FOOD_CHAR];
    });
    return total;
}

const updateSelectedCharInfo = () => {
    const unit_list = FOOD_CHAR.split(' ');
    const unit = unit_list[unit_list.length - 1];
    const total = totalFoodChar();
    const total_filtered = total.toString().substring(0, MAX_STRING_LENGTH);
    second_task_div.select('#selected-char-info')
        .text(`${total_filtered} ${unit}`);
}

// Second Task
const secondTaskManager = (alimentos) => {

    const listExclude = ['name', 'emoji'];

    const columns = alimentos.columns.filter(column => !listExclude.includes(column));

    // Append food options to select
    second_task_div.select('#food-char')
        .selectAll('option')
        .data(columns, (_, i) => i)
        .enter()
        .append('option')
        .attr('value', d => d)
        .attr('id', (d, i) => `${i}-${d}`)
        .attr('list-idx', (_, i) => i)
        .attr('class', 'food-char-opt')
        .text(d => d);

    updateSelectedCharInfo();

    second_task_div.select('#food-char')
        .on('change', function () {

            // Checked option
            let option = d3.select(this).select('option:checked');

            // Get food char from columns
            let char = columns[option.attr('list-idx')];

            FOOD_CHAR = char;

            graph.select("#graph-title").text(`${FOOD_CHAR} consumido`);
            graph.select("#graph-yLeyend").text(`${FOOD_CHAR}`);

            thirdTaskManager();
            updateSelectedCharInfo();
        });
}


// Usefull functions for third task


// Third Task
const thirdTaskManager = () => {

    // Definimos las escalas
    let max_amount = d3.max(SELECTED_FOOD, (item) => item.amount * item.food[FOOD_CHAR]);

    const escalaAltura = d3
        .scaleLinear()
        .domain([0, max_amount])
        .range([0, height - margin.top - margin.bottom]);

    const escalaY = d3
        .scaleLinear()
        .domain([0, max_amount])
        .range([height - margin.top - margin.bottom, 0]);

    const escalaX = d3
        .scaleBand()
        .domain(SELECTED_FOOD.map(d => d.name))
        .rangeRound([0, width - margin.right - margin.left])
        .padding(0.5);

    const ejeY = d3.axisLeft(escalaY);
    const ejeX = d3.axisBottom(escalaX);

    contenedorEjeY
        .transition()
        .duration(1000)
        .call(ejeY)
        .selectAll("line")
        .attr("x1", width - margin.right - margin.left)
        .attr("stroke-dasharray", "5")
        .attr("opacity", 0.5)
        .selection();

    contenedorEjeX
        .transition()
        .duration(1000)
        .call(ejeX)
        .selectAll("text")
        .attr("font-size", 12)
        .selection();

    contenedorBarras
        .selectAll("rect")
        .data(SELECTED_FOOD, d => d.name)
        .join(
            (enter) =>
                enter
                    .append('rect')
                    .transition().duration(500).style('opacity', 1)
                    .attr("fill", d => d.color)
                    .attr("width", escalaX.bandwidth())
                    .attr("height", (d) => escalaAltura(d.amount * d.food[FOOD_CHAR]))
                    .attr("x", (d) => escalaX(d.name))
                    .attr("y", (d) => escalaY(d.amount * d.food[FOOD_CHAR]))
                    .attr("value", (d) => d.amount * d.food[FOOD_CHAR])
                    .selection()
            ,
            (update) =>
                update
                    .transition().duration(500).style('opacity', 1)
                    .attr("width", escalaX.bandwidth())
                    .attr("height", (d) => escalaAltura(d.amount * d.food[FOOD_CHAR]))
                    .attr("x", (d) => escalaX(d.name))
                    .attr("y", (d) => escalaY(d.amount * d.food[FOOD_CHAR]))
                    .attr("value", (d) => d.amount * d.food[FOOD_CHAR])
                    .selection()
            ,
            (exit) =>
                exit.transition().duration(500).style('opacity', 0).remove()

        )
        .on("mouseover", (d) => {
            const value = d.currentTarget.getAttribute("value");
            contenedorBarras
                .append("text")
                .attr("x", parseInt(d.currentTarget.getAttribute("x")) + parseInt(escalaX.bandwidth() / 2))
                .attr("y", d.currentTarget.getAttribute("y") - 5)
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("text-decoration-style", "solid")
                .attr("font-size", `12px`)
                .attr("fill", "black")
                .text(value);
        })
        .on("mouseout", () => {
            contenedorBarras
                .selectAll("text")
                .remove();
        });
}

initialLoad().then(({ alimentos }) => {
    firstTaskManager(alimentos);
    secondTaskManager(alimentos);
    thirdTaskManager();
});
