import pytest

import activity_log


def test_setup_logger_creates_log_directory(tmp_path):
    log_dir = tmp_path / 'logs'

    activity_log.setup_logger(str(log_dir))

    assert log_dir.exists()


def test_log_search_success_writes_expected_line(tmp_path):
    logger = activity_log.setup_logger(str(tmp_path))

    activity_log.log_search(logger, 'lofi beats', result_count=24)
    for handler in logger.handlers:
        handler.flush()

    contents = (tmp_path / 'gadtube.log').read_text()
    assert 'search   | q="lofi beats" | 24 results' in contents


def test_log_search_error_writes_expected_line(tmp_path):
    logger = activity_log.setup_logger(str(tmp_path))

    activity_log.log_search(logger, 'bad query', error='Search timed out')
    for handler in logger.handlers:
        handler.flush()

    contents = (tmp_path / 'gadtube.log').read_text()
    assert 'search   | q="bad query" | error: Search timed out' in contents


def test_log_download_success_writes_expected_line(tmp_path):
    logger = activity_log.setup_logger(str(tmp_path))

    activity_log.log_download(logger, 'dQw4w9WgXcQ', 'Rick Astley')
    for handler in logger.handlers:
        handler.flush()

    contents = (tmp_path / 'gadtube.log').read_text()
    assert 'download | video_id=dQw4w9WgXcQ title="Rick Astley" | ok' in contents


def test_log_download_error_writes_expected_line(tmp_path):
    logger = activity_log.setup_logger(str(tmp_path))

    activity_log.log_download(logger, 'xxxxxxxxxxx', 'Some Title', error='yt-dlp failed')
    for handler in logger.handlers:
        handler.flush()

    contents = (tmp_path / 'gadtube.log').read_text()
    assert 'download | video_id=xxxxxxxxxxx title="Some Title" | error: yt-dlp failed' in contents


def test_setup_logger_uses_thirty_day_retention(tmp_path):
    logger = activity_log.setup_logger(str(tmp_path))

    handler = logger.handlers[0]
    assert handler.backupCount == 30
    assert handler.when.upper() == 'MIDNIGHT'


def test_setup_logger_closes_previous_handler_on_reinit(tmp_path):
    logger = activity_log.setup_logger(str(tmp_path))
    old_handler = logger.handlers[0]

    activity_log.setup_logger(str(tmp_path))

    assert old_handler.stream is None or old_handler.stream.closed


def test_log_search_raises_if_neither_result_count_nor_error_given(tmp_path):
    logger = activity_log.setup_logger(str(tmp_path))

    with pytest.raises(ValueError):
        activity_log.log_search(logger, 'oops query')
