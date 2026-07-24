import textwrap

from config import DEFAULT_PORT, load_port


def test_load_port_missing_file_returns_default(tmp_path):
    missing = tmp_path / "does_not_exist.ini"
    assert load_port(str(missing)) == DEFAULT_PORT


def test_load_port_valid_file_returns_configured_port(tmp_path):
    config_file = tmp_path / "config.ini"
    config_file.write_text(textwrap.dedent("""\
        [server]
        port = 8080
        """))
    assert load_port(str(config_file)) == 8080


def test_load_port_missing_key_returns_default(tmp_path):
    config_file = tmp_path / "config.ini"
    config_file.write_text("[server]\n")
    assert load_port(str(config_file)) == DEFAULT_PORT


def test_load_port_missing_section_returns_default(tmp_path):
    config_file = tmp_path / "config.ini"
    config_file.write_text("[other]\nkey = value\n")
    assert load_port(str(config_file)) == DEFAULT_PORT


def test_load_port_non_integer_value_returns_default(tmp_path):
    config_file = tmp_path / "config.ini"
    config_file.write_text(textwrap.dedent("""\
        [server]
        port = not-a-number
        """))
    assert load_port(str(config_file)) == DEFAULT_PORT
