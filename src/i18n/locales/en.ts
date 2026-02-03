export interface Translations {
  home: {
    title: string;
    subtitle: string;
    createButton: string;
    features: {
      pickDates: {
        title: string;
        description: string;
      };
      setTimeRange: {
        title: string;
        description: string;
      };
      shareLink: {
        title: string;
        description: string;
      };
      viewResults: {
        title: string;
        description: string;
      };
    };
    howItWorks: {
      title: string;
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
      step4: {
        title: string;
        description: string;
      };
    };
  };
  createEvent: {
    pageTitle: string;
    backToHome: string;
    eventDetails: string;
    eventTitle: string;
    eventTitlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    timezone: string;
    selectDates: string;
    datesSelected: string;
    timeRange: string;
    startTime: string;
    endTime: string;
    slotDuration: string;
    slotDurations: {
      15: string;
      30: string;
      60: string;
    };
    createButton: string;
    creating: string;
    success: string;
  };
  eventView: {
    backToHome: string;
    share: string;
    linkCopied: string;
    participants: string;
    participant: string;
    participants_plural: string;
    noParticipants: string;
    noResponses: string;
    shareToCollect: string;
    groupAvailability: string;
    hoverToSee: string;
    addYourAvailability: string;
    edit: string;
    shareThisLink: string;
    copy: string;
  };
  participantForm: {
    backToEvent: string;
    yourAvailabilityFor: string;
    instructions: string;
    yourName: string;
    yourNamePlaceholder: string;
    selectAvailableTimes: string;
    dragInstructions: string;
    slotsSelected: string;
    submitButton: string;
    updateButton: string;
    submitting: string;
    success: string;
    selectAtLeastOne: string;
  };
  errors: {
    somethingWentWrong: string;
    unexpectedError: string;
    tryAgain: string;
    goToHome: string;
  };
  notFound: {
    title: string;
    description: string;
    goToHome: string;
  };
  validation: {
    titleRequired: string;
    titleMaxLength: string;
    descriptionMaxLength: string;
    timezoneRequired: string;
    selectAtLeastOneDate: string;
    maxDates: string;
    invalidTimeFormat: string;
    nameRequired: string;
    nameMaxLength: string;
  };
  common: {
    loading: string;
  };
  privacy: {
    title: string;
    description: string;
  };
}

export const en: Translations = {
  home: {
    title: "Find the Perfect Time to Meet",
    subtitle: "Create an event, share a link, and let everyone mark their availability. See the best meeting times at a glance.",
    createButton: "Create New Event",
    features: {
      pickDates: {
        title: "Pick Dates",
        description: "Select potential meeting dates from a calendar view",
      },
      setTimeRange: {
        title: "Set Time Range",
        description: "Define the hours and time slot duration",
      },
      shareLink: {
        title: "Share Link",
        description: "Send the event link to all participants",
      },
      viewResults: {
        title: "View Results",
        description: "See everyone's availability on a heatmap",
      },
    },
    howItWorks: {
      title: "How It Works",
      step1: {
        title: "Create your event",
        description: "Add a title, select dates, and set time preferences",
      },
      step2: {
        title: "Share the link",
        description: "Send the unique link to everyone who needs to respond",
      },
      step3: {
        title: "Participants mark availability",
        description: "Each person drags to select their available time slots",
      },
      step4: {
        title: "Find the best time",
        description: "The heatmap shows when most people are available",
      },
    },
  },
  createEvent: {
    pageTitle: "Create New Event",
    backToHome: "Back to Home",
    eventDetails: "Event Details",
    eventTitle: "Event Title *",
    eventTitlePlaceholder: "e.g., Team Meeting",
    description: "Description (optional)",
    descriptionPlaceholder: "Add any details about the event...",
    timezone: "Timezone",
    selectDates: "Select Dates *",
    datesSelected: "{count} date(s) selected",
    timeRange: "Time Range",
    startTime: "Start Time",
    endTime: "End Time",
    slotDuration: "Slot Duration",
    slotDurations: {
      15: "15 minutes",
      30: "30 minutes",
      60: "1 hour",
    },
    createButton: "Create Event",
    creating: "Creating...",
    success: "Event created successfully!",
  },
  eventView: {
    backToHome: "Back to Home",
    share: "Share",
    linkCopied: "Link copied to clipboard!",
    participants: "Participants",
    participant: "participant",
    participants_plural: "participants",
    noParticipants: "No participants yet",
    noResponses: "No responses yet",
    shareToCollect: "Share the link to collect availability",
    groupAvailability: "Group Availability",
    hoverToSee: "Hover over slots to see who is available",
    addYourAvailability: "Add Your Availability",
    edit: "Edit",
    shareThisLink: "Share this link to collect availability:",
    copy: "Copy",
  },
  participantForm: {
    backToEvent: "Back to Event",
    yourAvailabilityFor: "Your Availability for {eventTitle}",
    instructions: "Click and drag to select the times when you are available.",
    yourName: "Your Name *",
    yourNamePlaceholder: "Enter your name",
    selectAvailableTimes: "Select Your Available Times",
    dragInstructions: "Drag to select multiple time slots. Click on selected slots to deselect them.",
    slotsSelected: "{count} time slot(s) selected",
    submitButton: "Submit Availability",
    updateButton: "Update Availability",
    submitting: "Submitting...",
    success: "Availability submitted successfully!",
    selectAtLeastOne: "Please select at least one time slot",
  },
  errors: {
    somethingWentWrong: "Something went wrong",
    unexpectedError: "An unexpected error occurred. Please try again or contact support if the problem persists.",
    tryAgain: "Try Again",
    goToHome: "Go to Home",
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or the event may have been removed.",
    goToHome: "Go to Home",
  },
  validation: {
    titleRequired: "Title is required",
    titleMaxLength: "Title must be less than 100 characters",
    descriptionMaxLength: "Description must be less than 500 characters",
    timezoneRequired: "Timezone is required",
    selectAtLeastOneDate: "Select at least one date",
    maxDates: "Maximum 31 dates allowed",
    invalidTimeFormat: "Invalid time format",
    nameRequired: "Name is required",
    nameMaxLength: "Name must be less than 50 characters",
  },
  common: {
    loading: "Loading...",
  },
  privacy: {
    title: "Privacy Notice",
    description: "This tool does not require login and does not collect personal data. All availability data is stored temporarily for scheduling purposes only.",
  },
};
