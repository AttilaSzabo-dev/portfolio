/* ********** Tool functions *********** */

function s(id) {
	return document.getElementById(id);
}
function random(min_nmb, max_nmb) {
	var result = Math.floor((Math.random() * (max_nmb - min_nmb + 1)) + min_nmb);
	return result;
}
/* ********** Shop functions *********** */

function showShop() {
	$( "#dialogBackground" ).hide( "drop", { direction: "up" }, "fast" );
	setTimeout(function() {
		$( "#shopBackground" ).show( "drop", { direction: "down" }, "fast" );
	},1000);
}
function hideShop() {
	$( "#shopBackground" ).hide( "drop", { direction: "down" }, "fast" );
	setTimeout(function() {
		$( "#dialogBackground" ).show( "drop", { direction: "up" }, "fast" );
	},1000);
};
function shop_toArena() {
	$( "#shopBackground" ).hide( "drop", { direction: "down" }, "fast" );
	setTimeout(function() {
		$( "#arenaBackground" ).show( "drop", { direction: "up" }, "fast" );
	},1000);
};


/* ********** Arena functions *********** */

function showArena() {
	$( "#dialogBackground" ).hide( "drop", { direction: "up" }, "fast" );
	setTimeout(function() {
		$( "#arenaBackground" ).show( "drop", { direction: "down" }, "fast" );
	},1000);
};
function hideArena() {
	$( "#arenaBackground" ).hide( "drop", { direction: "down" }, "fast" );
	setTimeout(function() {
		$( "#dialogBackground" ).show( "drop", { direction: "up" }, "fast" );
	},1000);
};

function enableAttack_buttonOnly() {
	$( "#attackButton" ).show();
	$( "#attackButton_cover" ).hide();
}
function disableAttack_buttonOnly() {
	$( "#attackButton" ).hide();
	$( "#attackButton_cover" ).show();
}
function enableAction_buttons() {
	$( "#attackButton, #retreatButton" ).show();
	$( "#attackButton_cover, #retreatButton_cover" ).hide();
}
function disableAction_buttons() {
	$( "#attackButton, #retreatButton" ).hide();
	$( "#attackButton_cover, #retreatButton_cover" ).show();
}
function enableLoot_select() {
	$( "#lootSelect" ).show();
	$( "#lootSelect_cover" ).hide();
}
function disableLoot_select() {
	$( "#lootSelect" ).hide();
	$( "#lootSelect_cover" ).show();
}
function calculateAct_Attack() {
	enemyAttack = random(creatures[enemyLvl]['min_attack'], creatures[enemyLvl]['max_attack']);
	$("#actualAttack_value").html(enemyAttack);
}


/* ********** Refresh functions *********** */

function load_success() {
	refresh(where_are_we);
	refresh_stats();
}
function refresh(actual_stage) {
	$('#questDisplay').html(book[actual_stage]['question']);
	$('#choice_01').html(book[actual_stage]['answers'][0]);
	$('#choice_02').html(book[actual_stage]['answers'][1]);
	$('#choice_03').html(book[actual_stage]['answers'][2]);
}
function refresh_stats() {
	$('#healthValue').html(myHealth);
	$('#initValue').html(myInitiative);
	$('#attackValue').html(myAttack);
	$('#extra_attackValue').html('+ ' + my_extraAttack);
	$('#armorValue').html(myDefense);
	$('#extra_armorValue').html('+ ' + my_extraDefense);
	$('#coinAmount').html(coinAmount);
}

/* ********** Common functions *********** */

function choice(answer_num) {
	where_are_we = book[where_are_we]['ref'][answer_num - 1];
	refresh(where_are_we);
	if (book[where_are_we]['encounter']['shop_available']) {
		//showShop();
		canWe_cont();
	}
}

function canWe_cont() {
	if (book[where_are_we]['encounter']['possibility']) { 
		if (chance[book[where_are_we]['encounter']['probability']][random(1, 10)]) load_opponent(where_are_we);
	}
}
function load_opponent(which_one) {
	showArena();
	enemyLvl = random(book[which_one]['encounter']['min_monsterLvl'], book[which_one]['encounter']['max_monsterLvl']);
	enemyHealth = creatures[enemyLvl]['hp'];
	calculateAct_Attack();
	enemyInitiative = creatures[enemyLvl]['initiative'];
	enemyName = creatures[enemyLvl]['name'];
	
	$('#monsterName').html(creatures[enemyLvl]['name']);
	$('#monsterPic').css("background-image", creatures[enemyLvl]['picture']);
	$('#minAttack_value').html(creatures[enemyLvl]['min_attack']);
	$('#maxAttack_value').html(creatures[enemyLvl]['max_attack']);
	$('#monsterHealth_value').html(enemyHealth);
	$('#monsterInitiative_value').html(enemyInitiative);
	setTimeout(function () {
		initiativeChallenge();
	},1600);
}
function initiativeChallenge() {
	var my_finalInitiative = random(0, myInitiative);
	var enemy_finalInitiative = random(0, enemyInitiative);
	
	if (my_finalInitiative > enemy_finalInitiative) {
		print_logMessages("playerStart");
		enableAction_buttons();
	}
	else if (my_finalInitiative < enemy_finalInitiative) {
		print_logMessages("enemyStart");
		setTimeout(function () {
			monsterAttack();
		},800);
	}
	else {
		var makeRandom = random(0, 100);
		if (makeRandom >= 50) {
			print_logMessages("playerStart");
			enableAction_buttons();
		}
		else {
			print_logMessages("enemyStart");
			setTimeout(function () {
				monsterAttack();
			},800);
		}
	}
}

/* ********** Battle functions *********** */

function playerAttack() {
	disableAction_buttons();
	activeWeapon = $(".carousel-inner > div.active").attr("title");
	
	if (enemyHealth > 0) {
		switch(activeWeapon) {
		case "Sword":
			enemyHealth = enemyHealth - (myAttack + my_extraAttack);
			useStamina();
			print_logMessages("playerSword_dmg");
			break;
		case "Fireball":
			enemyHealth = enemyHealth - spells[1]['value'];
			useMana(spells[1]["mana"]);
			print_logMessages("playerFireball_dmg");
			break;
		case "Heal":
			myHealth = myHealth + spells[0]['value'];
			$('#healthValue').html(myHealth);
			useMana(spells[0]["mana"]);
			print_logMessages("heal");
			break;
		}
		$('#monsterHealth_value').html(enemyHealth);
		if (enemyHealth <= 0) battleFinished();
		else {
			setTimeout(function () {
				monsterAttack();
			},800);
		}
	}
}
function monsterAttack() {
	myHealth = myHealth - (enemyAttack - (myDefense + my_extraDefense));
	$('#healthValue').html(myHealth);
	print_logMessages("enemyDamage");
	calculateAct_Attack();
	$(".carousel-inner div").each(function() {
		if ($(this).hasClass('active')) {
			var actualItem = $(this).attr('title');
			if (actualItem == spells[0]["name"]) {
				var potentialMana_value = manaSpend + spells[0]['mana'];
				if (potentialMana_value > 10) {
					enableAction_buttons();
					disableAttack_buttonOnly();
				}
				else enableAction_buttons();
			}
			else if (actualItem == spells[1]["name"]) {
				var potentialMana_value = manaSpend + spells[1]['mana'];
				if (potentialMana_value > 10) {
					enableAction_buttons();
					disableAttack_buttonOnly();
				}
				else enableAction_buttons();
			}
			else enableAction_buttons();
		}
	})
}
function battleFinished() {
	battleFinished_switch = true;
	disableAction_buttons();
	enableLoot_select();
	setTimeout(function() {
		print_logMessages("victory");
	},800);
}
function sortLoot(bool) {
	disableLoot_select();
	if (bool) {
		myAttack = myAttack + loot[creatures[enemyLvl]["loot"]]["value"];
		$("#attackValue").html(myAttack);
	}
	else {
		myDefense = myDefense + loot[creatures[enemyLvl]["loot"]]["value"];
		$("#armorValue").html(myDefense);
	}
	setTimeout(function() {
		battleFinished_switch = false;
		hideArena();
	},2500);
}
function useMana(manaValue) {
	for (var i = manaSpend; i <= (manaValue + manaSpend) - 1; ++i) {
		looseMana(i);
	}
	manaSpend += manaValue;
	
	var potentialMana_value = manaSpend + manaValue;
	if (potentialMana_value > 10) disableAttack_buttonOnly();
}
function looseMana(id) {
	var manaId = 'mana_' + id;
	$('#' + manaId).animate({
		backgroundColor: 'black'
	},800);
}
function useStamina() {
	for (var i = staminaSpend; i <= (staminaValue + staminaSpend) - 1; ++i) {
		looseStamina(i);
	}
	staminaSpend += staminaValue;
	
	var potentialStamina_value = staminaSpend + staminaValue;
	if (potentialStamina_value > 10) disableAttack_buttonOnly();
}
function looseStamina(id) {
	var staminaId = 'stamina_' + id;
	$('#' + staminaId).animate({
		backgroundColor: 'black'
	},800);
}

function sliderCheck() {

	$(".carousel-inner div").each(function() {
		if ($(this).hasClass('active')) {
			originalCarousel_track = $(this).attr('title');
			nextCarousel_track = originalCarousel_track;
		}
	})
	
	var checkActive_class = setInterval(function() {
		
		$(".carousel-inner div").each(function() {
			if ($(this).hasClass('active')) {
				nextCarousel_track = $(this).attr('title');
				if (nextCarousel_track == originalCarousel_track) {
					disableAttack_buttonOnly();
				}
				else {
					if (nextCarousel_track == spells[0]['name']) {
						$("#attackButton, #attackButton_cover").html('Heal!');
						var potentialMana_value = manaSpend + spells[0]['mana'];
						if (potentialMana_value > 10) disableAttack_buttonOnly();
						else {
							if (battleFinished_switch) disableAction_buttons();
							else enableAttack_buttonOnly();
						} 
					}
					else if (nextCarousel_track == spells[1]['name']) {
						$("#attackButton, #attackButton_cover").html('Burn!');
						var potentialMana_value = manaSpend + spells[1]['mana'];
						if (potentialMana_value > 10) disableAttack_buttonOnly();
						else {
							if (battleFinished_switch) disableAction_buttons();
							else enableAttack_buttonOnly();
						} 
					}
					else {
						$("#attackButton, #attackButton_cover").html('Attack!');
						if (battleFinished_switch) disableAction_buttons();
						else enableAttack_buttonOnly();
						//itt majd csekkolni kell a STAMINA -t
					} 
					clearInterval(checkActive_class);
				}
			}
		})
		
	},50);
	
}

/* ********** Message functions *********** */

function print_logMessages(message) {

	if (logMessages.length == 5) logMessages.shift();
	
	var enemyStart = enemyName + ' has the initiative!';
	var enemyDamage = enemyName + ' has caused ' + (enemyAttack - (myDefense + my_extraDefense)) + ' damage!';
	var playerSword_dmg = 'You have caused ' + (myAttack + my_extraAttack) + ' damage!';
	var playerFireball_dmg = 'Fireball have caused ' + spells[1]['value'] + ' damage!';
	var playerHeal_value = 'You have gained ' + spells[0]['value'] + ' health!';
	var lootSelection= "Loot value is: " + loot[creatures[enemyLvl]["loot"]]["value"];
	
	switch(message) {
		case "playerStart":
			logMessages.push("You have the initiative!");
			break;
		case "enemyStart":
			logMessages.push(enemyStart);
			break;
		case "playerSword_dmg":
			logMessages.push(playerSword_dmg);
			break;
		case "playerFireball_dmg":
			logMessages.push(playerFireball_dmg);
			break;
		case "enemyDamage":
			logMessages.push(enemyDamage);
			break;
		case "heal":
			logMessages.push(playerHeal_value);
			break;
		case "victory":
			logMessages.push("You are victorius! " + lootSelection);
			break;
	}
	
	$('#logDisplay').html('');
	for (var i = logMessages.length - 1; i >= 0; --i) {
		/*var dt = new Date(Date.now());
		var timePrint = dt.getHours() + ":" + dt.getMinutes();*/
		s('logDisplay').innerHTML += /*timePrint + ' - ' + */logMessages[i] + '<br/>';
	}
}