import Joi from "joi";

// validate create project data from client
export const valdiateProject = (project) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(2).max(100).required(),
    
  });
  return schema.validate(project);
};
