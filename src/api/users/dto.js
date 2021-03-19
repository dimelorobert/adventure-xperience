// Data Transfer Object

export default {
	single: (resource, msg, authUser) => ({
		id: resource.id,
		email: resource.email,
		message: msg,
	}),

	multiple: (resources, authUser, msg) =>
		resources.map(resource => single(resource, authUser, msg)),
};
