export const en = {
  notifications: {
    close: {
      text: "Close",
    },
    gpg: {
      add: {
        title: "GPG signature",
        description: {
          in_progress:
            "You will be prompted to choose a password for the key in a new window. Choose a reliable and unique keyword. Otherwise, your key can be easily compromised",
          default:
            "We can handle the GPG signature for this profile. What happens after clicking on the button: a new GPG key will be created, it will be added to the cloud profile, after that, all your commits will be signed with this key",
        },
        button: {
          in_progress: "In process...",
          default: "Let it GPG!",
        },
      },
      remove: {
        title: "Remove GPG",
        description:
          "After clicking on the button, commits will no longer be signed with a GPG signature, the key will be deleted from the local and cloud profile, as well as from the system",
        button: {
          in_progress: "Processing...",
          default: "Delete",
        },
      },
      manage: {
        copy: "Copy",
        remove: "Remove",
      },
    },
    import: {
      buttons: {
        github: "Import GitHub profile",
        local: "Use local profile",
      },
    },
    intro: {
      title: "Welcome",
      description:
        "So far, not a single Git profile has been processed. How about logging in to the cloud or using the local one?",
      button: {
        active: "Later",
        default: "Let's do it!",
      },
    },
    manager: {
      add: {
        text: {
          active: "Cancel",
          default: "Add a new profile",
        },
      },
      manage: {
        to_settings: "To settings",
        remove: "Delete",
      },
      profile: {
        avatar_alt: "User avatar",
        remoteness: {
          remote: "Cloud",
          local: "Local",
        },
        lock: {
          unlocked: "Finish",
          locked: "Edit",
        },
        sync_status: {
          error: "Synchronization error",
          in_progress: "Synchronization...",
          default: "Synchronized",
        },
        placeholders: {
          email: "Email",
          name: "Name",
        },
      },
    },
    ssh: {
      add: {
        title: "SSH key",
        description:
          "We can handle SSH key for this profile. What happens after clicking on the button: a new SSH key will be created, it will be added to the cloud profile and to the trusted ones in ssh-agent",
        button: {
          in_progress: "Processing...",
          default: "Let it SSH!",
        },
      },
      remove: {
        title: "Delete SSH key",
        description:
          "After clicking on the button, you will no longer be able to log in using SSH, the sign will be deleted from the local keyring and cloud profile",
        button: {
          in_progress: "Processing...",
          default: "Delete",
        },
      },
      manage: {
        copy: "Copy",
        remove: "Remove",
      },
    },
    update: {
      title: "Dogit has been updated",
      description: `You are now using version __version__. Hurray!
      You can read the patch notes on the page of this release on GitHub`,
      button: "What's new?",
    },
    updater: {
      title: "New version available",
      description:
        'Is it time to upgrade? Version __version__ is already available and ready for installation. By clicking on the "Install" button, the application will restart',
      buttons: {
        install: "Install",
        skip: "Skip",
      },
    },
  },
  errors: {
    git_not_available: {
      title: "Git not detected",
      description:
        "It seems that Git is not installed on your system. If this error continues to appear even after installing Git, please create an issue.",
      action_text: "Install Git",
    },
    gpg_not_available: {
      title: "GPG not installed",
      description:
        "It seems that GPG is not installed on your system. If this error continues to appear even though the gpg command is available, please create an issue.",
      action_text: "Install GPG",
    },
    ssh_not_available: {
      title: "SSH not installed",
      description:
        "It appears that SSH is not installed on your system. If you continue to encounter this error and the ssh command is still available, please create an issue.",
      action_text: "Install SSH",
    },
    generic: {
      title: "Error",
      description:
        "It seems like a technical error has occurred. However, is a minor issue. It's just one of those things that happen sometimes ¯\\_(ツ)_/¯",
      action_text: "Close",
    },
    gpg_add_unknown_error:
      "Could not generate a GPG key due to an unknown error",
  },
  info: {
    generic: {
      title: "Notification",
      action_text: "Okay",
    },
    gpg_copied: {
      title: "Copied",
      description:
        "The public key of the GPG signature was copied to the clipboard",
    },
    ssh_copied: {
      title: "Copied",
      description: "The SSH public key was copied to the clipboard",
    },
  },
};
