import configparser

DEFAULT_PORT = 5000


def load_port(config_path):
    """Read [server] port from an INI file, falling back to DEFAULT_PORT
    if the file, section, key are missing, or the value isn't an integer."""
    parser = configparser.ConfigParser()
    read_files = parser.read(config_path)
    if not read_files:
        return DEFAULT_PORT
    try:
        return parser.getint('server', 'port')
    except (configparser.NoSectionError, configparser.NoOptionError, ValueError):
        return DEFAULT_PORT
