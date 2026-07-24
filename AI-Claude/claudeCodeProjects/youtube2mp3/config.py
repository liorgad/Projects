import configparser

DEFAULT_PORT = 5000


def load_port(config_path):
    """Read [server] port from an INI file, falling back to DEFAULT_PORT
    if the file, section, or key is missing, the value isn't an integer,
    or the file is malformed."""
    parser = configparser.ConfigParser()
    try:
        read_files = parser.read(config_path)
        if not read_files:
            return DEFAULT_PORT
        return parser.getint('server', 'port')
    except (configparser.Error, ValueError):
        return DEFAULT_PORT
