// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
use commands::{generate_ssh_keys, remove_ssh_key, write_ssh_key};

use tauri::{
    image::Image,
    tray::{ClickType, TrayIconBuilder},
    Manager,
};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_positioner::{Position, WindowExt};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let webview = app.get_webview_window("main").unwrap();
            let win = webview.as_ref().window();

            win.move_window(Position::BottomRight).unwrap();

            let icon = Image::from_bytes(include_bytes!("../icons/icon.png")).unwrap();

            TrayIconBuilder::new()
                .icon(icon)
                .on_tray_icon_event(move |_, event| match event.click_type {
                    ClickType::Left => {
                        win.show().unwrap();
                        win.set_focus().unwrap();
                        win.emit("open", {}).unwrap();
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            generate_ssh_keys,
            write_ssh_key,
            remove_ssh_key
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
