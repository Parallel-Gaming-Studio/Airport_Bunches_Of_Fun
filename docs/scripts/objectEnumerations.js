// JavaScript Document

/*---------------------ObjectEnumerations-----------------------------\
| - Class to enumerate all of the different object types.
\--------------------------------------------------------------------*/

const typeEnum = Object.freeze(
{
	"type_entity":"type_entity",
	"type_moving_entity":"type_moving_entity",
	"type_shape":"type_shape",
	"type_gem_circle":"type_gem_circle",
	"type_gem_heart":"type_gem_heart",
	"type_gem_pentagon":"type_gem_pentagon",
	"type_gem_rectangle":"type_gem_rectangle",
	"type_gem_square":"type_gem_square",
	"type_gem_star":"type_gem_star",
	"type_gem_triangle":"type_gem_triangle",
	"type_gem_sponsor_argo_tea":"type_gem_sponsor_argo_tea",
	"type_gem_sponsor_auntie_annes":"type_gem_sponsor_auntie_annes",
	"type_gem_sponsor_brookstone":"type_gem_sponsor_brookstone",
	"type_gem_sponsor_bsmooth":"type_gem_sponsor_bsmooth",
	"type_gem_sponsor_burrito_beach":"type_gem_sponsor_burrito_beach",
	"type_gem_sponsor_chicago_sports":"type_gem_sponsor_chicago_sports",
	"type_gem_sponsor_cnn":"type_gem_sponsor_cnn",
	"type_gem_sponsor_coach":"type_gem_sponsor_coach",
	"type_gem_sponsor_dunkin_donuts":"type_gem_sponsor_dunkin_donuts",
	"type_gem_sponsor_duty_free_store":"type_gem_sponsor_duty_free_store",
	"type_gem_sponsor_field":"type_gem_sponsor_field",
	"type_gem_sponsor_hudson":"type_gem_sponsor_hudson",
	"type_gem_sponsor_mac":"type_gem_sponsor_mac",
	"type_gem_sponsor_nuts_on_clark":"type_gem_sponsor_nuts_on_clark",
	"type_gem_sponsor_rocky_mountain_chocolate_factory":"type_gem_sponsor_rocky_mountain_chocolate_factory",
	"type_gem_sponsor_sarahs_candies":"type_gem_sponsor_sarahs_candies",
	"type_gem_sponsor_shoe_hospital":"type_gem_sponsor_shoe_hospital",
	"type_gem_sponsor_spirit_of_the_red_horse":"type_gem_sponsor_spirit_of_the_red_horse",
	"type_gem_sponsor_talie":"type_gem_sponsor_talie"
});

/*---------------------getNameOfType----------------------------------\
| - Returns the name of a type as a string.
\--------------------------------------------------------------------*/
function getNameOfType(w) {
    var s;
    
    switch(w) {
        case typeEnum.type_entity:
            s = "Entity";
            break;
		case typeEnum.type_moving_entity:
            s = "MovingEntity";
            break;
		case typeEnum.type_shape:
            s = "Shape";
            break;
        case typeEnum.type_gem_circle:
            s = "Circle";
            break;
        case typeEnum.type_gem_heart:
            s = "Heart";
            break;
        case typeEnum.type_gem_pentagon:
            s = "Pentagon";
            break;
        case typeEnum.type_gem_rectangle:
            s = "Rectangle";
            break;
        case typeEnum.type_gem_square:
            s = "Square";
            break;
        case typeEnum.type_gem_star:
            s = "Start";
            break;
        case typeEnum.type_gem_triangle:
            s = "Triangle";
            break;
        case typeEnum.type_gem_sponsor_argo_tea:
            s = "ARGO TEA";
            break;
        case typeEnum.type_gem_sponsor_auntie_annes:
            s = "AUNTIE ANNES";
            break;
        case typeEnum.type_gem_sponsor_brookstone:
            s = "BROOKSTONE";
            break;
        case typeEnum.type_gem_sponsor_bsmooth:
            s = "BSMOOTH";
            break;
        case typeEnum.type_gem_sponsor_burrito_beach:
            s = "BURRITO BEACH";
            break;
        case typeEnum.type_gem_sponsor_chicago_sports:
            s = "CHICAGO SPORTS";
            break;
        case typeEnum.type_gem_sponsor_cnn:
            s = "CNN";
            break;
        case typeEnum.type_gem_sponsor_coach:
            s = "COACH";
            break;
        case typeEnum.type_gem_sponsor_dunkin_donuts:
            s = "DUNKIN DONUTS";
            break;
        case typeEnum.type_gem_sponsor_duty_free_store:
            s = "DUTY FREE STORE";
            break;
        case typeEnum.type_gem_sponsor_field:
            s = "FIELD";
            break;
        case typeEnum.type_gem_sponsor_hudson:
            s = "HUDSON";
            break;
        case typeEnum.type_gem_sponsor_mac:
            s = "MAC";
            break;
        case typeEnum.type_gem_sponsor_nuts_on_clark:
            s = "NUTS ON CLARK";
            break;
        case typeEnum.type_gem_sponsor_rocky_mountain_chocolate_factory:
            s = "ROCKY MOUNTAIN CHOCOLATE FACTORY";
            break;
        case typeEnum.type_gem_sponsor_sarahs_candies:
            s = "SARAHS CANDIES";
            break;
        case typeEnum.type_gem_sponsor_shoe_hospital:
            s = "SHOE HOSPITAL";
            break;
        case typeEnum.type_gem_sponsor_spirit_of_the_red_horse:
            s = "SPIRIT OF THE RED HORSE";
            break;
        case typeEnum.type_gem_sponsor_talie:
            s = "TALIE";
            break;
        default:
            s = "UNKNOWN OBJECT TYPE";
            break;
    }
    return s;
}

/*---------------------getTypeByName----------------------------------\
| - Returns the type for the privided name.
\--------------------------------------------------------------------*/
function getTypeByName(w) {
    var s;
    
    switch(w) {
		case "Entity":
            s = typeEnum.type_entity;
            break;
		case "MovingEntity":
            s = typeEnum.type_moving_entity;
            break;
        case "Shape":
            s = typeEnum.type_shape;
            break;
        case "Circle":
            s = typeEnum.type_gem_circle;
            break;
        case "Heart":
            s = typeEnum.type_gem_heart;
            break;
        case "Pentagon":
            s = typeEnum.type_gem_pentagon;
            break;
        case "Rectangle":
            s = typeEnum.type_gem_rectangle;
            break;
        case "Square":
            s = typeEnum.type_gem_square;
            break;
        case "Start":
            s = typeEnum.type_gem_star;
            break;
        case "Triangle":
            s = typeEnum.type_gem_triangle;
            break;
        case "sponsorArgo":
            s = typeEnum.type_gem_sponsor_argo_tea;
            break;
        case "sponsorAuntieAnnes":
            s = typeEnum.type_gem_sponsor_auntie_annes;
            break;
        case "sponsorBrookstone":
            s = typeEnum.type_gem_sponsor_brookstone;
            break;
        case "sponsorBSmooth":
            s = typeEnum.type_gem_sponsor_bsmooth;
            break;
        case "sponsorBurritoBeach":
            s = typeEnum.type_gem_sponsor_burrito_beach;
            break;
        case "sponsorChicagoSports":
            s = typeEnum.type_gem_sponsor_chicago_sports;
            break;
        case "sponsorCNN":
            s = typeEnum.type_gem_sponsor_cnn;
            break;
        case "sponsorCoach":
            s = typeEnum.type_gem_sponsor_coach;
            break;
        case "sponsorDunkinDonuts":
            s = typeEnum.type_gem_sponsor_dunkin_donuts;
            break;
        case "sponsorDutyFreeStore":
            s = typeEnum.type_gem_sponsor_duty_free_store;
            break;
        case "sponsorField":
            s = typeEnum.type_gem_sponsor_field;
            break;
        case "sponsorHudson":
            s = typeEnum.type_gem_sponsor_hudson;
            break;
        case "sponsorMacCosmetics":
            s = typeEnum.type_gem_sponsor_mac;
            break;
        case "sponsorNutsOnClark":
            s = typeEnum.type_gem_sponsor_nuts_on_clark;
            break;
        case "sponsorRockyMountainChocolate":
            s = typeEnum.type_gem_sponsor_rocky_mountain_chocolate_factory;
            break;
        case "sponsorSarahsCandies":
            s = typeEnum.type_gem_sponsor_sarahs_candies;
            break;
        case "sponsorShoeHospital":
            s = typeEnum.type_gem_sponsor_shoe_hospital;
            break;
        case "sponsorSpiritOfTheRedHorse":
            s = typeEnum.type_gem_sponsor_spirit_of_the_red_horse;
            break;
        case "sponsorTalie":
            s = typeEnum.type_gem_sponsor_talie;
            break;
        default:
            s = "UNKNOWN OBJECT TYPE";
            break;
    }
    return s;
}