// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
use commands::{generate_ssh_keys, remove_ssh_key, write_ssh_key};

use tauri::{Manager, SystemTray, SystemTrayEvent};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_positioner::{Position, WindowExt};

fn main() {
    tauri_plugin_deep_link::prepare("tt.dogi.app");

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_positioner::init())
        .system_tray(SystemTray::new())
        .setup(|app| {
            let win = app.get_window("main").unwrap();
            win.move_window(Position::BottomRight).unwrap();

            let handle = app.handle();
            tauri_plugin_deep_link::register("dogit", move |request| {
                handle.emit_all("scheme-request-received", request).unwrap();
            })
            .unwrap();

            #[cfg(not(target_os = "macos"))]
            if let Some(url) = std::env::args().nth(1) {
                win.show().unwrap();
                win.set_focus().unwrap();
                app.emit_all("scheme-request-received", url).unwrap();
            }

            Ok(())
        })
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let win = app.get_window("main").unwrap();

                win.show().unwrap();
                win.set_focus().unwrap();
                app.emit_all("open", {}).unwrap();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            generate_ssh_keys,
            write_ssh_key,
            remove_ssh_key
        ])
        .run(tauri::generate_context!())
        .unwrap();
}
