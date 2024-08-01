import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  key: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  projectName: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdTime: { type: Date, required: true },
  issuetype: { type: String, required: true },
  assignee: { type: String, required: true },

});

// For Customer issue type
const customerIssueSchema = new mongoose.Schema({
  // Add fields specific to Customer issue type
  IssueLink1: { type: String },
  linkedissue1: { type: String },
  priority: { type: String },
  customerDocumentName: { type: String },
  customerDocumentVersion: { type: String },
  customerDocumentReference: { type: String },
  requirementAllocation: { type: String },
  compliance: { type: String },
  status: { type: String },
  release: { type: String },
  functional: { type: String },
  

});

// For System issue type
const systemIssueSchema = new mongoose.Schema({
  // Add fields specific to System issue type
  IssueLink1: { type: String },
  linkedissue1: { type: String },
  IssueLink2: {type: String},
  linkedissue2: {type: String},
  priority: { type: String },
  fuSaASILLevel: { type: String },
  components: { type: String },
  functional: { type: String },
  requirementAllocation: { type: String },
  feasible: { type: String },
  verifiable: { type: String },
  verificationCriteria: { type: String },
  buildPriority: { type: String },
  riskItem: { type: String },
  status: { type: String },
  release: { type: String },
});

// For task issue type
const taskIssueSchema = new mongoose.Schema({
  // Add fields specific to task issue type
  IssueLink1: { type: String },
  linkedissue1: { type: String },
  IssueLink2: {type: String},
  linkedissue2: {type: String},
  priority: { type: String },
  fuSaASILLevel: { type: String },
  components: { type: String },
  functional: { type: String },
  requirementAllocation: { type: String },
  feasible: { type: String },
  verifiable: { type: String },
  verificationCriteria: { type: String },
  buildPriority: { type: String },
  riskItem: { type: String },
  status: { type: String },
  release: { type: String },
});


// For Software issue type
const softwareIssueSchema = new mongoose.Schema({
  // Add fields specific to software issue type
  IssueLink1: { type: String },
  linkedissue1: { type: String },
  IssueLink2: {type: String},
  linkedissue2: {type: String},
  priority: { type: String },
  fuSaASILLevel: { type: String },
  components: { type: String },
  RequirementType: { type: String },
  feasible: { type: String },
  verificationCriteria: { type: String },
  OriginalEstimate: { type: String },
  RemainingEstimate: { type: String },
  reviewer: { type: String },
  status: { type: String },

});

// Define model for Customer issue
const CustomerIssue = Issue.discriminator('CustomerIssue', customerIssueSchema);

// Define model for System issue
const SystemIssue = Issue.discriminator('SystemIssue', systemIssueSchema);
// Define model for System issue
const SoftwareIssue = Issue.discriminator('SoftwareIssue', softwareIssueSchema);
// Define model for System issue
const taskIssue = Issue.discriminator('taskIssue', taskIssueSchema);


export { CustomerIssue, SystemIssue, SoftwareIssue, taskIssue };