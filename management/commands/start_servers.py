from django.core.management.base import BaseCommand
import subprocess

class Command(BaseCommand):
    print("Starting servers...")
    # import pdb;pdb.set_trace()
    help = 'Starts the Django development server and Flask server'
    print(help)

    def handle(self, *args, **options):
        print("step 1")
        
        # Define paths
        manage_py_path = 'D:/Brudite/dhruv-git/placement_cell/manage.py'
        start_servers_py_path = 'D:/Brudite/dhruv-git/placement_cell/management/commands/start_servers.py'
        # Start Django development server
        self.stdout.write(self.style.SUCCESS('Starting Django development server...'))
        django_server_process = subprocess.Popen(['python', manage_py_path, 'runserver'])

        # Start Flask server
        self.stdout.write(self.style.SUCCESS('Starting Flask server...'))
        flask_server_process = subprocess.Popen(['python', start_servers_py_path])

        try:
            print("Waiting for servers to finish...")
            # Wait for servers to finish
            django_server_process.wait()
            flask_server_process.wait()
        except KeyboardInterrupt:
            print("Received keyboard interrupt, stopping servers...")
            # Handle keyboard interrupt
            django_server_process.terminate()
            flask_server_process.terminate()

        self.stdout.write(self.style.SUCCESS('Servers have been stopped.'))









app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///default.db'
app.config['SQLALCHEMY_BINDS'] = {
    'SV_BIND_KEY': 'sqlite:///other.db'
}

db = SQLAlchemy(app)
SV_BIND_KEY = 'scripts_db'
class ParsedNCPDPLine(db.Model):
    __bind_key__ = 'SV_BIND_KEY'
    __tablename__ = "vw_ncpdp_parsed_data"
    __table_args__ = {'schema': 'sv', 'autoload': True, 'autoload_with': db.metadata}

    id = db.Column(db.Integer, name="SVT Detail Line Id", primary_key=True)
    claim_id = db.Column(db.Integer, name="SVT Claim#")
    rx_ref_number_qualifier = db.Column(db.String, name="Rx/Service Ref. Number Qual.")
    rx_ref_number = db.Column(db.String, name="Rx/Service Ref. Number")
    
    
    
    
    