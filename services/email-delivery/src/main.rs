mod smtp_server;

use actix_web::{get, post, web, App, Responder, HttpResponse, HttpServer};
use actix_cors::Cors;

use serde::{Deserialize};

use lettre::{Message, SmtpTransport, Transport};
use lettre::message::header::ContentType;

use std::io;
use std::env;
use std::thread;

#[derive(Debug, Deserialize)]
struct MessageRequest {
    email: String,
    content: String,
}

#[get("/")]
async fn health_check() -> impl Responder {
    log::info!("Health check endpoint received a GET request");
    HttpResponse::Ok().body("This is a health check")
}

#[post("/email")]
async fn post_email(data: web::Json<MessageRequest>) -> impl Responder {
    log::info!("Received POST /email request with data: {:?}", data);
    let req = data.into_inner();
    log::info!("Parsed email request for recipient: {}", req.email);
    match send_email(req) {
        Ok(status) => {
            log::info!("Email sent successfully: {}", status);
            HttpResponse::Ok().body(format!("Message received.\nStatus: {}", status))
        },
        Err(e) => {
            log::error!("Failed to send email: {:?}", e);
            HttpResponse::InternalServerError().body(format!("An error occurred: {}", e))
        },
    }
}

fn send_email(req: MessageRequest) -> Result<String, Box<dyn std::error::Error>> {
    log::info!("Building email message for recipient: {}", req.email);
    let email = Message::builder()
        .from("no-reply@example.com".parse()?)
        .to(req.email.parse()?)
        .subject("Test from mock email service")
        .header(ContentType::TEXT_PLAIN)
        .body(req.content)?;
    log::info!("Email message built successfully.");

    log::info!("Creating SMTP transport to localhost.");
    let mailer = SmtpTransport::builder_dangerous("127.0.0.1")
        .port(2525)
        .build();
    log::info!("SMTP transport created.");

    log::info!("Sending email...");
    match mailer.send(&email) {
        Ok(response) => {
            log::info!("Email sent successfully, response: {:?}", response);
            Ok(format!("Email sent successfully: {:?}", response))
        },
        Err(e) => {
            log::error!("Error sending email: {:?}", e);
            Err(Box::new(e))
        },
    }
}


#[actix_web::main]
async fn main() -> io::Result<()> {
    env::set_var("RUST_LOG", "debug");
    env::set_var("RUST_BACKTRACE", "full");
    env_logger::init();

    // Spawn SMTP server in a separate thread
    thread::spawn(|| {
        smtp_server::run_smtp_server();
    });

    let port = 7878;
    println!("Server running on port {port}");

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::default()
                .allow_any_header()
                .allow_any_method()
                .allow_any_origin()
            )
            .service(health_check)
            .service(post_email)
    })
        .bind(format!("127.0.0.1:{}", port))?
        .run()
        .await
}
