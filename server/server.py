#!/usr/bin/env python3
"""
Simple HTTP server for the scholarship management system.
This server handles CORS and serves static files.
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS support."""
    
    def end_headers(self):
        """Add CORS headers to all responses."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight OPTIONS requests."""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests."""
        # Default to index.html for root requests
        if self.path == '/':
            self.path = '/index.html'
        
        return super().do_GET()

def start_server(port=3000):
    """Start the HTTP server."""
    try:
        # Change to the script directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        with socketserver.TCPServer(("", port), CORSRequestHandler) as httpd:
            print(f"🚀 Python server running at http://localhost:{port}")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"\n📋 Available pages:")
            print(f"   • Homepage: http://localhost:{port}/")
            print(f"   • Login: http://localhost:{port}/login.html")
            print(f"   • Apply: http://localhost:{port}/apply.html")
            print(f"   • Admin: http://localhost:{port}/admin.html")
            print(f"\n🛑 Press Ctrl+C to stop the server\n")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server shutting down...")
        print("✅ Server stopped successfully")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Get port from command line argument or use default
    port = 3000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 3000.")
    
    start_server(port)