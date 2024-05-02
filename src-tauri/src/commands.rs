use directories::UserDirs;
use serde::Serialize;
use std::{
    fs::{create_dir_all, read_to_string, remove_file, write},
    process::Command,
};
use tempfile::TempDir;

#[derive(Serialize)]
pub struct SSHKeyPair {
    pub private_key: String,
    pub public_key: String,
}

#[tauri::command]
pub fn generate_ssh_keys(email: String) -> Result<SSHKeyPair, String> {
    // Create a temporary directory
    let temp_dir =
        TempDir::new().map_err(|_| "Failed to create temporary directory".to_string())?;

    // Set the temporary directory path for saving the key files
    let private_key_path = temp_dir.path().join("id_ed25519");
    let public_key_path = temp_dir.path().join("id_ed25519.pub");

    // Generate the SSH keys in the temporary directory
    let output = Command::new("ssh-keygen")
        .args(&[
            "-t",
            "ed25519",
            "-f",
            private_key_path.to_str().unwrap(),
            "-N",
            "",
            "-C",
            &email,
        ])
        .output()
        .map_err(|_| "Failed to execute ssh-keygen command".to_string())?;

    if output.status.success() {
        // Read the private and public keys from the generated files
        let private_key = read_to_string(private_key_path)
            .map_err(|_| "Failed to read private key file".to_string())?;
        let public_key = read_to_string(public_key_path)
            .map_err(|_| "Failed to read public key file".to_string())?;

        // Delete the temporary directory and its contents
        temp_dir
            .close()
            .map_err(|_| "Failed to delete temporary directory".to_string())?;

        Ok(SSHKeyPair {
            private_key,
            public_key,
        })
    } else {
        Err(format!(
            "Error generating SSH key: {}",
            std::str::from_utf8(&output.stderr).unwrap()
        ))
    }
}

#[tauri::command]
pub fn write_ssh_key(key: String) -> Result<String, String> {
    if let Some(user_dirs) = UserDirs::new() {
        let home = user_dirs.home_dir();
        let ssh_folder_path = home.join(".ssh");
        let private_path = ssh_folder_path.join("id_rsa");

        create_dir_all(ssh_folder_path).map_err(|err| err.to_string())?;
        write(&private_path, key).map_err(|err| err.to_string())?;

        Ok(private_path.to_string_lossy().into_owned())
    } else {
        Err("Failed to get user directory".to_string())
    }
}

#[tauri::command]
pub fn remove_ssh_key() -> Result<(), String> {
    if let Some(user_dirs) = UserDirs::new() {
        let home = user_dirs.home_dir();
        let ssh_folder_path = home.join(".ssh");
        let private_path = ssh_folder_path.join("id_rsa");

        remove_file(private_path).map_err(|err| err.to_string())?;

        Ok(())
    } else {
        Err("Failed to get user directory".to_string())
    }
}
