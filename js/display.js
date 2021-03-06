'use strict';

var elName = document.getElementById('name-select');
var elMonsterSelect = document.getElementById('monster-select');
var elLevelSelect = document.getElementById('level-select');
var elCreateForm = document.getElementById('create-enemy');

elCreateForm.addEventListener('submit', handleSubmit);

var loadData = function () {
  var monsterArray = Object.keys(MakeMonster.all);
  monsterArray.forEach(function (monster) {
    addToSquad(MakeMonster.all[monster]);
    displayChart(MakeMonster.all[monster]);
    populateOtherStats(MakeMonster.all[monster]);
  });
};

if (localStorage['MakeMonster.all']) {
  MakeMonster.all = JSON.parse(localStorage['MakeMonster.all']);
  loadData();
}


// Populate dropdown

function handleSubmit(e) {
  e.preventDefault();

  // clear the form!

  var monsterName = elName.value;
  var monsterSelected =
    elMonsterSelect.options[elMonsterSelect.selectedIndex].value;
  var levelSelected = elLevelSelect.options[elLevelSelect.selectedIndex].value;

  var newMonster = new MakeMonster(
    monsters[monsterSelected],
    monsterName,
    levelSelected
  );
  newMonster.render();
  addToSquad(newMonster);
  displayChart(newMonster);
  populateOtherStats(newMonster);
  e.target.reset();

}

// CHART STUFF

function displayChart(monster) {
  var displaySection = document.getElementById('results-display');

  displaySection.classList.remove('ghost');
  var healthStat = monster.averagehp;
  var healthArray = [];
  healthArray.push(healthStat);

  Chart.defaults.global.defaultFontColor = '#FF5D5D';

  var ctx = document.getElementById('myChart');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'Total Health',
          data: [healthStat],
          backgroundColor: '#FF5D5D'
        }
      ]
    },
    options: {
      legend: {
        labels: {
          fontSize: 170,
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontSize: 200
            }
          }
        ],
      }
    }
  });

  var baseStats = [
    monster.strength,
    monster.dexterity,
    monster.constitution,
    monster.inteligence,
    monster.wisdom,
    monster.charisma
  ];


  var ctx2 = document.getElementById('myChart-base');
  var myBaseChart = new Chart(ctx2, {
    type: 'radar',
    data: {
      labels: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      datasets: [
        {
          label: 'Basic Stats',
          fill: true,
          backgroundColor: 'rgba(238, 118, 118, 0.4)',
          data: [
            monster.strength,
            monster.dexterity,
            monster.constitution,
            monster.inteligence,
            monster.wisdom,
            monster.charisma
          ],
          borderColor: [
            'rgba(219, 0, 29, 0.2)'
          ],
          borderWidth: 10,
        }
      ]
    },
    options: {
      elements: {
        hoverRadius: 10,
        hitRadius: 10
      },
      tooltips: {
        titleFontSize: 80,
        bodyFontSize: 60,
        padding: 15
      },
      scale: {
        pointLabels: {
          fontSize: 50,
        },
        angleLines: {
          color: 'white',
          lineWidth: '10'
        },
        gridLines: {
          color: 'rgba(255, 255, 255, 0.2)',
          lineWidth: '10'
        },
        ticks: {
          min: 0,
          max: 20,
          stepSize: 4,
          fontSize: 60,
          showLabelBackdrop: false,
          fontColor: '#00FF03',
        }
      },
      legend: {
        labels: {
          fontSize: 50,
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              display: false
            }
          }
        ]
      }
    }
  });
}

function populateOtherStats(monster) {
  var attributesTitle = document.getElementById('attr-title');
  attributesTitle.classList.remove('ghost');
  var statsList = document.getElementById('other-atts');

  //while there are li's in the ul, removeChild
  while (statsList.firstChild) {
    statsList.removeChild(statsList.firstChild);
  }

  var statLabels = [
    'StrMod:',
    'DexMod:',
    'ConMod:',
    'IntMod:',
    'WisMod:',
    'ChaMod:',
    'Speed:',
    'ArmorClass:',
    'Notes:',
    'HitBonus:',
    'Proficiency:',
    'AverageDamage:'
  ];

  var otherStats = [
    monster.strMod,
    monster.dexMod,
    monster.conMod,
    monster.intMod,
    monster.wisMod,
    monster.chaMod,
    monster.speed,
    monster.armorclass,
    monster.notesAbout,
    monster.hitbonus,
    monster.proficiency,
    monster.averagedamage
  ];
  for (var i = 0; i < otherStats.length; i++) {
    var elLi = document.createElement('li');
    elLi.innerHTML = `${statLabels[i]} <span class="green-attr">${otherStats[i]}</span>`;
    statsList.appendChild(elLi);

  }
}


// CREATED LIST STUFF

function addToSquad(monster) {
  var elSquadList = document.getElementById('created-list');
  console.log(elSquadList);

  var newSquadMember = document.createElement('li');
  newSquadMember.innerHTML = `NAME: <span class="green-attr">${monster.name}</span> - ADJ LVL: <span class="green-attr">${monster.increment}</span> <button class="selectMonster" data-type="show-created-stats" data-name="${monster.name}">SHOW STATS</button><button class="remove-monster" data-name="${monster.name}">X</button>`;
  elSquadList.appendChild(newSquadMember);

  var elRemoveButton = document.getElementsByClassName('remove-monster');
  for (var i = 0; i < elRemoveButton.length; i++) {
    elRemoveButton[i].addEventListener('click', removeMonster);
  }

  var showButton = document.getElementsByClassName('selectMonster');
  for (var j = 0; j < showButton.length; j++) {
    console.log(showButton[j]);
    showButton[j].addEventListener('click', showCreatedStats);
  }
}

function showCreatedStats(e) {
  displayChart(MakeMonster.all[e.target.getAttribute('data-name')]);
  populateOtherStats(MakeMonster.all[e.target.getAttribute('data-name')]);
}

function removeMonster(e) {
  var removedMonster = e.target.getAttribute('data-name');
  var displaySection = document.getElementById('results-display');
  displaySection.classList.add('ghost');
  var elSquadList = document.getElementById('created-list');
  var elToRemove = document.querySelector(`[data-name=${removedMonster}]`);
  var listItem = elToRemove.parentNode;
  elSquadList.removeChild(listItem);
  delete MakeMonster.all[e.target.getAttribute('data-name')];
  localStorage.setItem('MakeMonster.all', JSON.stringify(MakeMonster.all));

}

