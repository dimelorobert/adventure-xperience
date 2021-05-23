import createUserEmail from "./createUserEmail";
import deleteUserEmail from "./deleteUserEmail";

const emailTemplates = {
	new_user: createUserEmail,
	delete_user: deleteUserEmail,
};

export default emailTemplates;
