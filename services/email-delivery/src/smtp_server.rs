use std::net::{TcpListener, TcpStream};
use std::io::{BufReader, BufRead, Write};
use std::thread;
use log::info;

/// Runs a simple SMTP server on 127.0.0.1:25
pub fn run_smtp_server() {
    // Bind to localhost on port 25. Note: Port 25 may require elevated privileges.
    let listener = TcpListener::bind("127.0.0.1:2525").expect("Failed to bind SMTP server to address");
    info!("SMTP Server running on 127.0.0.1:2525");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                // Spawn a new thread for each incoming connection
                thread::spawn(|| handle_client(stream));
            },
            Err(e) => {
                eprintln!("Failed to accept connection: {}", e);
            }
        }
    }
}

/// Handles an individual SMTP client connection
fn handle_client(mut stream: TcpStream) {
    // Send SMTP greeting
    if let Err(e) = stream.write_all(b"220 localhost SMTP Server Ready\r\n") {
        eprintln!("Failed to send greeting: {}", e);
        return;
    }

    let mut reader = BufReader::new(stream.try_clone().expect("Failed to clone TCP stream"));

    loop {
        let mut line = String::new();
        match reader.read_line(&mut line) {
            Ok(0) => break, // Connection closed
            Ok(_) => {
                info!("SMTP Server received: {}", line.trim_end());
                // If client sends QUIT, respond and close the connection
                if line.to_uppercase().starts_with("QUIT") {
                    let _ = stream.write_all(b"221 Bye\r\n");
                    break;
                } else {
                    // For any other command, reply with a generic OK response
                    let _ = stream.write_all(b"250 OK\r\n");
                }
            },
            Err(e) => {
                eprintln!("Error reading from client: {}", e);
                break;
            }
        }
    }
}
