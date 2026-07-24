import logging
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path

LOGGER_NAME = 'gadtube.activity'


def setup_logger(log_dir):
    """Configure and return the activity logger: one line per search/download,
    rotating at midnight, keeping 30 days of history."""
    log_dir = Path(log_dir)
    log_dir.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(LOGGER_NAME)
    logger.setLevel(logging.INFO)
    for h in logger.handlers[:]:
        h.close()
        logger.removeHandler(h)
    logger.propagate = False

    handler = TimedRotatingFileHandler(
        filename=str(log_dir / 'gadtube.log'),
        when='midnight',
        backupCount=30,
        encoding='utf-8',
    )
    handler.suffix = '%Y-%m-%d'
    handler.setFormatter(logging.Formatter('%(asctime)s | %(message)s', datefmt='%Y-%m-%d %H:%M:%S'))
    logger.addHandler(handler)
    return logger


def log_search(logger, query, result_count=None, error=None):
    if error is not None:
        detail = f'q="{query}" | error: {error}'
    else:
        if result_count is None:
            raise ValueError('log_search requires result_count when error is not given')
        detail = f'q="{query}" | {result_count} results'
    logger.info('%-8s | %s', 'search', detail)


def log_download(logger, video_id, title, error=None):
    if error is not None:
        detail = f'video_id={video_id} title="{title}" | error: {error}'
    else:
        detail = f'video_id={video_id} title="{title}" | ok'
    logger.info('%-8s | %s', 'download', detail)
