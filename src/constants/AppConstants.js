//local url
export const API_BASE_URL = "http://localhost:3001/v1/";

//staging url
//  export const API_BASE_URL = "http://3.110.37.237:3004/v1/";

//live url
// export const API_BASE_URL = "https://api.kisattendence.cf/v1";

export const AUTH = {
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  SEND_OTP: "auth/send-otp",
  RESET_PASSWORD: "auth/verify-otp-and-reset-password",
  CHANGE_PASSWORD: "auth/verify-otp-and-change-password",
};

export const USER = {
  GET_USER: "user/get-unchecked-users",
  GET_USER_COUNT: "user/user-count",
  GET_ALL_USER: "user/get-all",
  ADD_USER: "user/add/basic-details",
  ADD_USER_PERSONAL_DETAILS: "user/add/personal-details",
  ADD_USER_SALARY: "user/add/salary-details",
  ADD_USER_VERIFICATION: "user/add/verification-details",
  UPLOAD_USER_IMAGE: "user/image-upload",
  GET_BY_ID: "user/get/{id}",
  GET_USER_WITH_LEVEL_BY_ID: "user/level/get/{id}",
  GET_SALARY_BY_USER_ID: "user/get/salary/{id}",
  GET_VERIFICATION_DETAILS_BY_USER_ID: "user/get/verification-details/{id}",
  UPDATE_USER: "user/update-user/{id}",
  UPDATE_USER_VERIFICATION: "user/update/user-verification/{id}",
  UPDATE_USER_SALARY: "user/update/user-salary/{id}",
  DELETE_USER: "user/delete",
  EX_USER: "user/deactivate-employee",
  GET_EX_EMPLOYEES: "user/get-deactivated-employees",
  GET_USER_LEAVE_REPORT: "user/leave-report",
};

export const ATTENDENCE = {
  GET_TODAY_PRESENT: "attendence/today-present-count",
  GET_TODAY_REPORT: "attendence/today-report",
  GET_TODAY_WFH_REPORT: "attendence/today-wfh-report",
  GET_CURRENT_SESSION: "attendence/get-current-session/{id}",
  GET_CURRENT_MONTH_ATTENDENCE: "attendence/get-current-month-attednence/{id}",
  GET_SELECTED_RANGE_ATTENDENCE: "attendence/get-selected-range-attednence/{id}",
  UPDATE_ATTENDENCE: "attendence/update-attednence/{id}",
  ADD_ATTENDENCE: "attendence/add-new-attendence/{id}",
  DELETE_TIMEOUT: "attendence/remove-timeout/{id}",
  DELETE_BREAK:"attendence/remove-break/{id}",
};

export const ROLES = {
  GET: "roles/get",
  GET_USER_ROLE: "roles/get-user-role",
};

export const COUNT = {
  GET_COUNT: "admin/get-count",
};

export const LEAVES = {
  GET_LEAVE_COUNT: "leaves/today-leave-count",
  GET_USER_PENDING_LEAVES: "leaves/get-user-pending-leaves/{id}",
  GET_USER_LEAVES: "leaves/get-user-leaves/{id}",
  GET_USER_APPROVED_LEAVES: "leaves/get-user-approved-leaves/{id}",
  APPROVE_LEAVE: "leaves/approve/{id}",
  REJECT_LEAVE: "leaves/reject/{id}",
  GET_ALL_EMPLOYEE_LEAVES: "leaves/get-employees-leave",
  URGENT_LEAVE: "leaves/urgent_leave/{id}",
  CANCEL_LEAVE: "admin/cancel-approved-leave/{id}",
  MARK_ABSENT: "admin/mark-absent/{id}",
  TODAY_ON_LEAVE: "leaves/today-on-leave/{id}",
  GET_LEAVE_BY_ID: "leaves/get-leave-details/{leaveId}",
};

export const WORK_FROM_HOME = {
  APPROVE_WFH: "work-from-home/approve/{id}",
};

export const REQUEST = {
  GET_UNSEEN_REQUESTS: "request-changes/get-unseen-requests",
  GET_REQUEST: "request-changes/get-request-changes",
  REMOVE_REQUEST: "request-changes/delete-request-changes",
  UPDATE_SEEN_NOTIFICATIONS: "request-changes/update-seen-notifications",
  GET_SUBJECT_ID: "request-changes/get-subject-id",
};

export const THOUGHT = {
  ADD_THOUGHT: "thought/add-thought",
  GET_THOUGHT: "thought/list-thought",
  DELETE_THOUGHT: "thought/delete-thought",
  EDIT_THOUGHT: "thought/post-edit-thought/{id}",
  GET_THOUGHT_BY_ID: "thought/get-edit-thought/{id}",
};

export const REPORTS = {
  GET_REPORTS_DATA: "admin/get-report",
};
export const ORGANISATION = {
  GET_ALL_USERS: "admin/get-all-users",
  MANAGE_USERS: "admin/create-hierarchy",
  GET_ORGANISATION_DATA: "admin/get-organisation-data",
  GET_LEVELS: "admin/get-levels",
  ADD_USER_LEVEL: "admin/add-user-level",
  GET_ALL_EMPLOYEES: "admin/get-all-employees",
};
export const CANDIDATE = {
  ADD_CATEGORY :"candidate/add-category",
  GET_CATEGORY: "candidate/get-category",
  ADD_CANDIDATE: "candidate/add-candidate",
  GET_ALL_CANDIDATES: "candidate/get-candidate",
  GET_CANDIDATE_DETAIL: "candidate/get-candidate-detail/{candidateId}",
  // UPDATE_CANDIDATE: "candidate/update-candidate/{candidateId}",
  DELETE_CANDIDATE:"candidate/delete-candidate/{id}",
  ADD_RESULT_STATUS:"candidate/add-result-status",
  GET_RESULT_STATUS:"candidate/get-result-status",
  UPDATE_CANDIDATE:"candidate/update-candidate/{id}",
};
export const PROJECT = {
  GET_ALL_EMPLOYEES: "project/get-all-employees-sales-updates",
  ADD_PROJECT: "project/add-project",
  EDIT_PROJECT_DETAILS: "project/edit-project-details/{projectId}",
  ARCHIVE_PROJECT_BY_ID: "project/archive-project/{projectId}",
  DELETE_PROJECT_RECIPIENTS: "project/delete-project-recipients/{projectId}",
  GET_ALL_PROJECTS: "project/get-projects",
  GET_ALL_ARCHIVED_PROJECTS: "/project/get-all-archived-projects",
  GET_USER_PROJECTS: "project/get-user-project-admin/{userId}",
  GET_PROJECT_BY_ID: "project/get-project-detail/{projectId}",
  UPDATE_PROJECT:"project/project-update/{projectId}",
  ADD_NEW_PROJECT_SUBJECT:"project/create-new/project-subject/{projectId}",
  GET_PROJECT_DETAILS_BY_ID:"project/get-project-update-status-detail/{projectId}",
  GET_PROJECT_SUBJECTS_BY_ID:"project/get-project/subjects-by-id/{projectId}",
  UPDATE_MESSAGE:"project/update-message/{messageId}",
  UPDATE_PROJECT_MESSAGE:"project/update/project-message/{projectMessageId}",
  ADD_DAILY_STATUS: "project/add-daily-status",
  ADD_DAILY_STATUS_IN_PROJECT_UPDATE: "project/add-daily-status_in/project_update",
  SEND_MAIL_TO_TAGGED_USERS: "project/send-mail-to-tagged-users",
  GET_SALES_STATUSES:"project/get-sales-status",
  GET_DAILY_STATUSES: "project/get-daily-status",
  GET_DEFAULT_PROJECT_STATUSES_BY_ID: "project/get-general-project-statuses/{userId}",
  GET_DEFAULT_PROJECT_STATUSES_SINGLE_USER: "project/get-general-project-statuses-user/{userId}",
  GET_PROJECT_UPDATES_BY_ID:"project/get-project-updates/{userId}",
  GET_SUBJECT_DETAILS:"project/get-subject-details/{subjectId}",
  GET_PROJECT_UPDATED_DETAILS:"project/get-project/updated-details/{projectId}",
  DELETE_MESSAGE:"project/delete-message/{messageId}",
  DELETE_PROJECT_MESSAGE:"project/delete/project-message/{projectMessageId}",
  GET_TEAM_PROFILE_IMAGES:"project/get-sales-team-profile-images",
};

export const DOCS = {
  CREATE_FOLDER:"/documents/add-document",
  GET_ALL_FOLDER: "/documents/get-all-documents",
  DELETE_DOC: "/documents/delete-doc",
  RENAME_DOC: "/documents/rename-doc/{folderId}",
  // EDIT_DOC_PERMISSIONS: "/documents/edit-permissions/{docId}",
  EDIT_DOC_PERMISSIONS: "/documents/edit-permissions",
  GET_DOCUMENT_BY_DOC_ID: "/documents/get-document-details/{docId}",
  GET_VERIFICATION_DOCUMENT_BY_DOC_ID: "/documents/get-document-details/{docId}",
  GET_FOLDER_PUBLIC_URL_DATA: "/documents/get-folder-details/{folderId}",
  GET_FILE_PUBLIC_URL_DATA: "/documents/get-file-details/{fileId}",
  UPDATE_DOCUMNET_ACCESS_MODE: "/documents/edit-doc-access-permission/{docId}",
} 

export const FORMS = {
  GET_ALL_FORMS: "/forms/get-all-forms",
  GET_FORM_BY_ID: "/forms/get-form-by-id/{formId}",
  CREATE_TEMPLATE_BY_USER_ID: "/forms/create-form-template-by-userId",
  GET_USER_FORM_DATA_BY_FORM_ID: "/forms/get-user-form-data-by-form-id/{formId}",
  GET_ALL_GENERATED_FORMS: "/forms/get-all-generated-forms",
  DELETE_FORM_BY_ID: "/forms/delete-form-by-id/{id}",
  UPDATE_FORM_MANAGER_NAME_BY_ID: "/forms/update-form-manager-by-form-id/{id}",
  UPDATE_USER_RELIEVING_FORM_STATUS_THROUGH_HR_BY_FORM_ID: "/forms/update-user-relieving-form-status-through-hr-by-form-id/{formId}",
  RE_ASSIGNED_FORM_TO_EMPLOYEE: "/forms/re-assigned-form"
} 

export const IMPORTANT_DATES = {
  get: "important-dates/get",
};
