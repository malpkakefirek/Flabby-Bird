kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("./assets/");

loadSprite("blue_bird", "birds/bluebird.png");
loadSprite("red_bird", "birds/redbird.png");
loadSprite("yellow_bird", "birds/yellowbird.png");

loadSprite("background", "background-day.png");
loadSprite("gameover_text", "gameover.png");
loadSprite("pipe", "pipe-green.png");
loadSprite("start_page", "start-page.png")

loadSound("die", "sounds/die.ogg")
loadSound("hit", "sounds/hit.ogg")
loadSound("point", "sounds/point.ogg")
loadSound("flap", "sounds/wing.ogg")

var highscore = 0;


scene("start", (highscore) => {
  layers([
		"game",
		"ui",
	], "game");

	add([
		sprite("background"),
		scale(width() / 496, height() / 512),
		origin("topleft"),
    pos(0, 0),
	]);
  
  const bird_type = choose(['blue_bird','red_bird','yellow_bird']);
  
  add([
    sprite("start_page"),
    pos(width() / 2, height() / 2),
    scale(0.75, height() / 512),
    origin("center"),
  ])

  add([
		text(`Best:\n${highscore}`, 12),
		pos(width() / 2, height() / 4),
		origin("top"),
	]);

  add([
    text("by Malpkakefirek", 8),
    origin("botright"),
    color(0.4, 0.4, 0.4),
    pos(width() - 5, height() - 5),
  ]);

  const player = add([
		sprite(bird_type),
		pos(width() / 2, height() / 2),
    origin("center"),
	]);

  keyPress("space", () => {
    go("main", highscore, bird_type)
	});

  mouseClick(() => {
    go("main", highscore, bird_type)
  });
});


scene("main", (highscore, bird_type) => {

	layers([
		"game",
		"ui",
	], "game");

	add([
		sprite("background"),
		scale(width() / 496, height() / 512),
		origin("topleft"),
    pos(0, 0),
	]);

	const player = add([
		sprite(bird_type),
		pos(width() / 2, height() / 2),
    origin("center"),
		body(),
	]);

	const JUMP_FORCE = 310;

  // jump on start
  player.jump(JUMP_FORCE);
  play("flap", {volume: 0.2,});

  // jump button
	keyPress("space", () => {
		player.jump(JUMP_FORCE);
    play("flap", {volume: 0.2,});
	});

  // alternate jump button
  mouseClick(() => {
    player.jump(JUMP_FORCE);
    play("flap", {volume: 0.2,});
  });

	player.action(() => {
		if (player.pos.y >= height()) {
      go('gameover', score.value, highscore);
		}
    if (player.pos.y < -100) {
      go('gameover', score.value, highscore);
		}
	});

	player.overlaps("pipe", () => {
    play("hit", {volume: 0.2,});
		go('gameover', score.value, highscore);
	});

	const PIPE_OPEN = 86;
	var PIPE_SPEED = 150;
  var SECONDS = 1.5;

	loop(SECONDS, () => {

		const pipePos = rand(20, height() - PIPE_OPEN - 20);

		add([
			sprite("pipe"),
      pos(width() + 50, pipePos),
      scale(1, -1),
			origin("top"),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width() + 50, pipePos + PIPE_OPEN),
			scale(1, 1),
			origin("top"),
			"pipe",
			{ passed: false, },
		]);

	});

	action("pipe", (pipe) => {

		pipe.move(-PIPE_SPEED, 0);

		if (pipe.pos.x + pipe.width <= player.pos.x && pipe.passed === false) {
			play("point", {volume: 0.05,});
      score.value++;
			score.text = score.value;
			pipe.passed = true;
		}

		if (pipe.pos.x + pipe.width < 0) {
			destroy(pipe);
		}

	});

	const score = add([
		pos(12, 12),
		text("0", 32),
		layer("ui"),
		{
			value: 0,
		},
	]);

});

scene("gameover", (score, highscore) => {

  wait(0.2, () => {
    play("die", {volume: 0.2,});
  });

  if (score > highscore) {
    highscore = score;
  }

  add([
    rect(width(), height()),
    color(0, 0, 0.15),
    pos(0, 0),
  ])
  
  add([
		sprite("gameover_text"),
    pos(width() / 2, height() / 2 - 120),
    origin('center'),
    scale(1.5),
  ])

	add([
		text(`Your score: ${score}`, 16),
		pos(width() / 2, height() / 2 + 20),
		origin("center"),
	]);
  
  add([
		text(`Highscore: ${highscore}`, 16),
		pos(width() / 2, height() / 2 + 45),
		origin("center"),
	]);

	add([
    text("Press space or tap!", 12),
    pos(width() / 2, height() / 2 + 110),
    origin('center'),
    color(0.66, 0.66, 0.66),
  ]);

  // to avoid accidently clicking
  wait(0.5, () => {
    keyPress('space', () => {
      go('start', highscore);
    });

    mouseClick(() => {
      go('start', highscore);
    });
  });

});

start("start", highscore);
