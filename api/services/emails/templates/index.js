import createUserEmail from "./createUserEmail";
import deleteUserEmail from "./deleteUserEmail";
import activateUserEmail from "./activateUserEmail";
import deactivateUserEmail from "./deactivateUserEmail";
import newCodeUserEmail from "./newCodeUserEmail";

const emailTemplates = {
	new_user: createUserEmail,
	delete_user: deleteUserEmail,
	activate_user: activateUserEmail,
	deactivate_user: deactivateUserEmail,
	new_code_user: newCodeUserEmail
};

export default emailTemplates;
