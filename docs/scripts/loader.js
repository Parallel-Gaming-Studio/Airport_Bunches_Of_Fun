// JavaScript Document

$.cachedScript = function (url, options) {
    options = $.extend(options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });
    return $.ajax(options);
}

async function loadTimerScript() {
    // Load scripts synchronously in dependent order
    const scrUtilities = await $.cachedScript("scripts/utils.js").done((script, textStatus) => {
        // console.log(`<Loader>[Utilities:Cache] ${textStatus}`);
    });
    const scrObjectEnumerations = await $.cachedScript("scripts/objectEnumerations.js").done((script, textStatus) => {
        // console.log(`<Loader>[ObjectEnumerations:Cache] ${textStatus}`);
    });
	const scrRegulator = await $.cachedScript("scripts/regulator.js").done((script, textStatus) => {
        // console.log(`<Loader>[Regulator:Cache] ${textStatus}`);
    });
    const scrPoints = await $.cachedScript("scripts/point.js").done((script, textStatus) => {
        // console.log(`<Loader>[Points:Cache] ${textStatus}`);
    });
    const scrVector2D = await $.cachedScript("scripts/vector2d.js").done((script, textStatus) => {
        // console.log(`<Loader>[Vector2D:Cache] ${textStatus}`);
    });
    const scrC2DMatrix = await $.cachedScript("scripts/c2dmatrix.js").done((script, textStatus) => {
        // console.log(`<Loader>[C2DMatrix:Cache] ${textStatus}`);
    });
    const scrTransformations = await $.cachedScript("scripts/transformations.js").done((script, textStatus) => {
        // console.log(`<Loader>[Transformations:Cache] ${textStatus}`);
    });
	const scrGeometry = await $.cachedScript("scripts/geometry.js").done((script, textStatus) => {
        // console.log(`<Loader>[Geometry:Cache] ${textStatus}`);
    });
	const scrEntityFunctionTemplates = await $.cachedScript("scripts/entityFunctionTemplates.js").done((script, textStatus) => {
        // console.log(`<Loader>[EntityFunctionTemplates:Cache] ${textStatus}`);
    });
    const scrBaseGameEntity = await $.cachedScript("scripts/baseGameEntity.js").done((script, textStatus) => {
        // console.log(`<Loader>[BaseGameEntity:Cache] ${textStatus}`);
    });
    const scrMovingEntity = await $.cachedScript("scripts/movingEntity.js").done((script, textStatus) => {
        // console.log(`<Loader>[MovingEntity:Cache] ${textStatus}`);
    });
	const scrSteeringBehaviors = await $.cachedScript("scripts/steeringBehaviors.js").done((script, textStatus) => {
        // console.log(`<Loader>[SteeringBehaviors:Cache] ${textStatus}`);
    });
    const scrTimer = await $.cachedScript("scripts/timer.js").done((script, textStatus) => {
        // console.log(`<Loader>[Timer:Cache] ${textStatus}`);
    });
    const scrShape = await $.cachedScript("scripts/shape.js").done((script, textStatus) => {
        // console.log(`<Loader>[Shape:Cache] ${textStatus}`);
    });
    const scrCircle = await $.cachedScript("scripts/circle.js").done((script, textStatus) => {
        // console.log(`<Loader>[Circle:Cache] ${textStatus}`);
    });
    const scrHeart = await $.cachedScript("scripts/heart.js").done((script, textStatus) => {
        // console.log(`<Loader>[Heart:Cache] ${textStatus}`);
    });
    const scrPentagon = await $.cachedScript("scripts/pentagon.js").done((script, textStatus) => {
        // console.log(`<Loader>[Pentagon:Cache] ${textStatus}`);
    });
    const scrRect = await $.cachedScript("scripts/rectangle.js").done((script, textStatus) => {
        // console.log(`<Loader>[Rectangle:Cache] ${textStatus}`);
    });
    const scrSquare = await $.cachedScript("scripts/square.js").done((script, textStatus) => {
        // console.log(`<Loader>[Square:Cache] ${textStatus}`);
    });
    const scrStar = await $.cachedScript("scripts/star.js").done((script, textStatus) => {
        // console.log(`<Loader>[Star:Cache] ${textStatus}`);
    });
    const scrTriangle = await $.cachedScript("scripts/triangle.js").done((script, textStatus) => {
        // console.log(`<Loader>[Triangle:Cache] ${textStatus}`);
    });
	const scrSponsored = await $.cachedScript("scripts/sponsored.js").done((script, textStatus) => {
        // console.log(`<Loader>[Sponsored:Cache] ${textStatus}`);
    });
};
loadTimerScript();

// Wait for dependent scripts to finish loading
function awaitScripts() {
    // Determine if the dependencies finished loading
    try {
        // Attempt to create a new timer
        var myTimer = new Timer();
        // Successfully created a timer
        // console.log("<Loader>[AwaitScripts] Timer ready");
        // console.log("<Loader>[AwaitScripts] Building page");
        // Build the page
        buildPage();
    } catch (e) {
        // Timer is not ready yet
        // console.log("<Loader>[AwaitScripts] Timer not ready");
        // Try again
        setTimeout(()=>{return awaitScripts();}, 500);
    }
}

// Construct the page elements
function buildPage() {
    // Load Reusables
    $.get('includes/reusables.html', (reusables) => {
        $("br").before(reusables);
    }).promise().done(() => {
        // console.log("<Loader> Reusables loaded");
        
        // Load Start Scene
        $.get('includes/start_scene.html', (start_scene) => {
            $("br").before(start_scene);
        }).promise().done(() => {
            // console.log("<Loader> Start scene loaded");
            
            // Load Play Scene
            $.get('includes/play_scene.html', (play_scene) => {
                $("br").before(play_scene);
            }).promise().done(() => {
                // console.log("<Loader> Play scene loaded");
                
                // Load Leaderboard Scene
                $.get('includes/leaderboard_scene.html', (leaderboard_scene) => {
                    $("br").before(leaderboard_scene);
                }).promise().done(() => {
                    // console.log("<Loader> Leaderboard scene loaded");

                    // Load End Scene
                    $.get('includes/end_scene.html', (end_scene) => {
                        $("br").before(end_scene);
                    }).promise().done(() => {
                        // console.log("<Loader> End scene loaded");
						
                        // Load Game Scripts
                        $("#abofScripts").html('<script src="scripts/engine.js"></script>').promise().done(() => {
                            $("#abofScripts script").after('<script src="scripts/game.js"></script>').promise().done(() => {
								$("#abofScripts script").after('<script src="scripts/gameplay.js"></script>').promise().done(() => {
									$.when("#abofScripts").done(() => {
										// console.log("<Loader> Executing scripts...");
										// Remove the <br> tag placeholder
										$("br").remove();
										game.google.load();
									});
								});
                            });
                        });
                    });
                });
            });
        });
    });
};

// Perform functions once the initial index.html finishes loading
$(document).ready(function() {
    // Once the page loads, start building the content
    awaitScripts();
});